<script>
import Layout from "../../../layouts/main.vue";
import PageHeader from "@/components/page-header";
import Multiselect from "@vueform/multiselect";
import "@vueform/multiselect/themes/default.css";

import "prismjs";
import "prismjs/themes/prism.css";
import { required, helpers,numeric } from "@vuelidate/validators";
import useVuelidate from "@vuelidate/core";
import { mapActions, mapGetters } from "vuex";
import moment from "moment";
import { CheckoutProvider, Checkout } from 'paytm-blink-checkout-vue'
import Loader from '@/components/loader'
export default {
  setup() {
    return { v$: useVuelidate() };
  },
  data() {
    return {
      title: "Add Order",
      order: {
        id: null,
        user_id: null,
        service_id: null,
        tenure: "onetime",
        final_amount: null,
        payment_status: "received",
        service_status: "processing",
        order_documents: [],
      },
      isSubmited: false,
      servicesData: [],
      commentsData: [],
      comment: {
        id: null,
        order_id: null,
        notes: null,
        is_send_email: true,
        is_personal_note: true,
        attachment: null,
      },
      selectedService: null,
      paytmCred:{},
      showPaytm:false,
      config:{},
      loader:false,
      disabled:false,
      paytmPayment:null,
      openInPopup:true,
      active:false,
      isEdit: false
    };
  },
  validations: {
    order: {
      user_id: {
        required: helpers.withMessage("User is required", required),
      },
      service_id: {
        required: helpers.withMessage("Service is required", required),
      },
      final_amount: {
        required: helpers.withMessage("Amount is required", required),
        numeric: helpers.withMessage("Please enter only numbers", numeric),
      },
    },
    comment: {
      notes: {
        required: helpers.withMessage("Notes is required", required),
      },
    },
  },
  components: {
    Layout,
    PageHeader,
    Multiselect,
    CheckoutProvider,
    Checkout,
    Loader
  },
  computed: {
    ...mapGetters({
      userData: "auth/user",
      getUserLists: "users/getUserLists",
    }),
    usersData() {
      var data = [];
      this.getUserLists.map((user) => {
        var payload = {
          value: user.id,
          label: user.name,
        };
        data.push(payload);
      });
      return data;
    },
    isServiceOrder(){
      return this.$route.name == "ServiceOrder" && this.$route.params.id ? true : false
    },
    isAdmin(){
      return this.userData && this.userData.role_id != 3 ? true : false
    },
    isUserOrderAdd(){
      return this.$route.name == "UserOrderAdd" ? true : false
    },
  },
  mounted() {
    if ((this.$route.name == "EditOrder" || this.$route.name == "UserOrderEdit") && this.$route.params.id) {
      this.isEdit = true
      this.getOrderData(parseInt(atob(this.$route.params.id)));
    }
    if (this.userData && this.userData.role_id == 3) {
      this.getServicesByUserData();
      this.order.user_id = this.userData.id
    }

    if (this.$route.name == "ServiceOrder" && this.$route.params.id) {
      this.order.service_id = parseInt(atob(this.$route.params.id))
      this.order.user_id = this.userData.id
      this.getServiceDocumentData();
    }
    this.fetchUserLists();
    // this.setupUserData();
  },
  methods: {
    ...mapActions({
      addOrder: "order/addOrder",
      getOrderById: "order/getOrderById",
      getServicesByUser: "service/getServicesByUser",
      getServiceById: "service/getServiceById",
      fetchUserLists: "users/fetchUserLists",
      addOrderComment: "order/addOrderComment",
      initiateTransaction: "payment/initiateTransaction",
      addUserOrderDB: "order/addUserOrder",
    }),
    clearOrder() {
      this.order = {
        id: null,
        user_id: null,
        service_id: null,
        tenure: null,
        final_amount: null,
        payment_status: "received",
        service_status: "processing",
        order_documents: [],
      };
    },
    saveOrder() {
      this.isSubmited = true;
      this.v$.order.$touch();
      if (this.v$.order.$invalid) {
        return;
      }
      this.loader = true;
      this.disabled = true;
      console.log("order_documents", this.order.order_documents);
      var formdata = new FormData();
      formdata.append("id", this.order.id);
      formdata.append("user_id", this.order.user_id);
      formdata.append("service_id", this.order.service_id);
      formdata.append("tenure", this.order.tenure);
      formdata.append("final_amount", this.order.final_amount);
      formdata.append("payment_status", this.order.payment_status);
      formdata.append("service_status", this.order.service_status);
      this.order.order_documents.map((doc) => {
        formdata.append(
          "order_documents_" + doc.service_documents_id,
          doc.uploaded_file
        );
      });
      this.addOrder(formdata)
        .then((res) => {
          if (res.data.status) {
            this.isSubmited = false;
            this.clearOrder();
            this.$toast.success("Order added Successfully");
            this.$router.push({ name: "Orders" });
          }
          this.loader = false;
          this.disabled = false;
        })
        .catch((error) => {
          this.loader = false;
          this.disabled = false;
          console.log("error", error);
        });
    },
    getOrderData(orderId) {
      this.getOrderById(orderId)
        .then((res) => {
          console.log(res);
          if (res.data.status) {
            let order = res.data.data.order;
            // let orderDocuments = order.order_documents;
            let orderUpdates = order.order_updates;
            if (order) {
              this.order = {
                id: order.id,
                user_id: order.user_id,
                service_id: order.service_id,
                tenure: order.tenure,
                final_amount: order.final_amount,
                payment_status: order.payment_status,
                service_status: order.service_status,
                order_documents: [],
              };
              this.commentsData = orderUpdates;
            }

            this.getServicesByUserData();
            this.getServiceDocumentData();

            // var nameDocument = [];
            // serviceDocument.map((doc) => {
            //   var docData = {
            //     id: doc.id,
            //     name: doc.name,
            //   };
            //   nameDocument.push(docData);
            // });
            // this.service.document_names = nameDocument;
            // console.log("nameDocument", nameDocument);
          } else {
            this.$router.push({ name: "AddOrder" });
          }
        })
        .catch((e) => {
          console.log(e);
        });
    },
    getServicesByUserData() {
      if (this.userData && this.userData.role_id != 3) {
        var userId = this.order.user_id;
      } else {
        // eslint-disable-next-line no-redeclare
        var userId = this.userData.id;
      }
      this.getServicesByUser(userId)
        .then((res) => {
          console.log(res);
          if (res.data.status) {
            var services = res.data.data.services;
            var serData = [];
            services.map((service) => {
              var payload = {
                value: service.id,
                label: service.title,
              };
              serData.push(payload);
            });
            console.log("serData", serData);
            this.servicesData = serData;
          } else {
            this.servicesData = [];
          }
        })
        .catch((e) => {
          console.log(e);
        });
    },
    setupUserData() {
      var userData = [];
      this.getUserLists.map((user) => {
        var payload = {
          value: user.id,
          label: user.name,
        };
        userData.push(payload);
      });
      this.usersData = userData;
    },
    getServiceDocumentData() {
      this.getServiceById(this.order.service_id)
        .then((res) => {
          if (res.data.status) {
            let service = res.data.data.service;
            this.selectedService = service;
            let serviceDocument = service.service_document;
            var nameDocument = [];
            serviceDocument.map((doc) => {
              console.log("doc data", doc);
              var docData = {
                id: null,
                service_documents_id: doc.id,
                service_documents_name: doc.name,
                uploaded_file: null,
              };
              nameDocument.push(docData);
            });
            this.order.order_documents = nameDocument;
            this.getServicePrice();
          }
        })
        .catch((e) => {
          console.log(e);
        });
    },
    onOrderDocChange(e, service_documents_id) {
      const file = e.target.files[0];
      if (file) {
        var fileUrl = file;
        this.order.order_documents.map((order_doc) => {
          if (order_doc.service_documents_id == service_documents_id) {
            order_doc.uploaded_file = fileUrl;
          }
        });
      }
      console.log("this.order.order_documents", this.order.order_documents);
    },
    getServicePrice() {
      console.log("get price");
      var servicePrices = JSON.parse(this.selectedService.prices);
      if (this.order.tenure == "onetime")
        this.order.final_amount = servicePrices.onetime;
      else if (this.order.tenure == "monthly")
        this.order.final_amount = servicePrices.monthly;
      else if (this.order.tenure == "quaterly")
        this.order.final_amount = servicePrices.quaterly;
      else if (this.order.tenure == "yearly")
        this.order.final_amount = servicePrices.yearly;
      else this.order.final_amount = 0;
    },
    getDate(date) {
      return moment(date).format("MM/DD/YY");
    },
    onAttechmentChange(e) {
      const file = e.target.files[0];
      if (file) {
        this.comment.attachment = file;
      }
      console.log("this.order.order_documents", this.order.order_documents);
    },
    clearComment() {
      this.comment = {
        id: null,
        order_id: null,
        notes: null,
        is_send_email: true,
        is_personal_note: true,
        attachment: null,
      };
      this.v$.comment.$reset();
    },
    addAttechmemt() {
      this.v$.comment.$touch();
      if (this.v$.comment.$invalid) {
        return;
      }
      var formdata = new FormData();
      formdata.append("id", this.comment.id);
      formdata.append("order_id", this.order.id);
      formdata.append("notes", this.comment.notes);
      formdata.append("is_send_email", this.comment.is_send_email);
      formdata.append("is_personal_note", this.comment.is_personal_note);
      formdata.append("attachment", this.comment.attachment);
      this.addOrderComment(formdata)
        .then((res) => {
          if (res.data.status) {
            var comment = res.data.data.comment;
            this.commentsData.push(comment);
            this.clearComment();
            this.$toast.success("Comment Added");
          }
        })
        .catch((error) => {
          console.log("error", error);
        });
    },
    initPayment(){
       this.openInPopup=true
       this.isSubmited = true;
      this.v$.order.$touch();
      if (this.v$.order.$invalid) {
        return;
      }
      this.loader = true;
      this.disabled = true;
      let payload={
        amount:this.order.final_amount.toFixed(2),
        redirect_url:window.location.href
      }
      this.initiateTransaction(payload).then((res)=>{
              if(res.data.status){
                this.paytmCred=res.data.data.transaction
                this.openPaytmModel()
              }else{
                this.loader=false
                this.disabled=false
                let message=res.data.message
                this.$toast.open({
                    message: message,
                    type: "error",
                  })
              }
      }).catch((error)=>{
        console.log(error)
            this.loader=false
            this.disabled=false
                  this.$toast.open({
                    message: 'Server Error',
                    type: "error",
                  })  
          })
    },
    openPaytmModel(){
      let self=this
      this.showPaytm=true
      this.config = {
              "root": "",
              "flow": "DEFAULT",
              "data": {
                "orderId": this.paytmCred.order_id,
                "token": this.paytmCred.token,
                "tokenType": "TXN_TOKEN",
                "amount": this.order.final_amount.toFixed(2),
                 "userDetail": {
                    "custId": this.paytmCred.custId,
                    "email": this.paytmCred.email
                }
              },
              "merchant": {
                    "mid": "MLnbED55834809939060",
                    "name": "",
                    "redirect": false
                },
              "handler": {
                "notifyMerchant": function(eventName,data){
                  console.log("notifyMerchant handler function called");
                  console.log("eventName => ",eventName);
                  console.log("data => ",data);
                },
                "transactionStatus":function(data){
                  // window.Paytm.CheckoutJS.invoke();
                  self.paytmPayment=data
                  self.ClosePaytmPopup()
                }  
              }
            };
    },
    ClosePaytmPopup(){
      const element = document.getElementById("paytm-checkoutjs");
      element.remove();
      this.showPaytm=false
      this.config=null
      this.openInPopup=false
      console.log(this.paytmPayment.STATUS,'sdsd')
      if(this.paytmPayment.STATUS == 'TXN_SUCCESS'){
          this.addUserOrder();
      }else{
          this.loader=false
          this.disabled=false
         let message=this.paytmPayment.RESPMSG
                this.$toast.open({
            message: message,
            type: "error",
          })
      }
    },
    addUserOrder(){
        let payload={
          ...this.order,
          transaction_id:this.paytmPayment.TXNID,
          paytm_order_id:this.paytmPayment.ORDERID,
          bank_transaction_id:this.paytmPayment.BANKTXNID,
          payment_amount:this.paytmPayment.TXNAMOUNT,
          bank_name:this.paytmPayment.BANKNAME,
          currency:this.paytmPayment.CURRENCY,
          payment_status:'received',
          gateway_name:this.paytmPayment.GATEWAYNAME,
          payment_mode:this.paytmPayment.PAYMENTMODE
        }
        this.active=true
        this.addUserOrderDB(payload).then((res)=>{
          if(res.data.status){
            this.active=false
             this.$toast.open({
                    message: "order added",
                    type: "success",
                  })
              this.$router.push({name:"OrderUser"})
          }else{
            this.active=false
            let message=res.data.message
             this.$toast.open({
                    message: message,
                    type: "error",
                  })
          }
        }).catch(()=>{
                   this.active=false
                    this.loader=false
                    this.disabled=false
                  this.$toast.open({
                    message: 'Server Error',
                    type: "error",
                  }) 
        });
    }
  },
};
</script>

<template>
  <Layout>
    <PageHeader />
    <Loader :active="active"/>
    <div class="row">
      <!-- <pre>{{paytmPayment}}</pre> -->
      <div class="col-xl-12">
        <div class="card">
          <div class="card-header align-items-center d-flex">
            <h4 class="card-title mb-0 flex-grow-1" @click="ClosePaytmPopup()">{{order.id ? 'Edit Order' : 'Add Order'}} {{isAdmin}}</h4>
          </div>
          <!-- end card header -->
          <div class="card-body">
            <div class="row">
              <div class="col-md-6">
                <h3 class="mb-4">Order Detail</h3>
                <div class="row mb-4">
                  <div class="col-lg-3">
                    <label for="title" class="form-label">User Name</label>
                  </div>
                  <div
                    class="col-lg-9"
                    v-if="userData && userData.role_id != 3"
                  >
                    <Multiselect
                      v-model="order.user_id"
                      :close-on-select="true"
                      :searchable="true"
                      :create-option="true"
                      :options="usersData"
                      @select="getServicesByUserData"
                      :class="{
                        'is-invalid': isSubmited && v$.order.user_id.$error,
                      }"
                    />
                    <div
                      v-for="(item, index) in v$.order.user_id.$errors"
                      :key="index"
                      class="invalid-feedback"
                    >
                      <span v-if="item.$message">{{ item.$message }}</span>
                    </div>
                  </div>
                  <div class="col-lg-9" v-else>
                    <h6>{{ userData.name }}</h6>
                  </div>
                </div>

                <div class="row mb-4">
                  <div class="col-lg-3">
                    <label for="title" class="form-label">Service Name</label>
                  </div>
                  <div class="col-lg-9">
                    <Multiselect
                      v-model="order.service_id"
                      :close-on-select="true"
                      :searchable="true"
                      :create-option="true"
                      :options="servicesData"
                      :disabled="(isServiceOrder || isEdit)"
                      @select="getServiceDocumentData"
                      :class="{
                        'is-invalid': isSubmited && v$.order.service_id.$error,
                      }"
                    />
                    <div
                      v-for="(item, index) in v$.order.service_id.$errors"
                      :key="index"
                      class="invalid-feedback"
                    >
                      <span v-if="item.$message">{{ item.$message }}</span>
                    </div>
                  </div>
                </div>

                <div class="row mb-4">
                  <div class="col-lg-3">
                    <label for="phone" class="form-label">Periodicity</label>
                  </div>
                  <div class="col-lg-9">
                    <div class="mt-4 mt-lg-0">
                      <div class="form-check form-check-inline">
                        <input
                          class="form-check-input"
                          type="radio"
                          id="onetime"
                          value="onetime"
                          v-model="order.tenure"
                          @change="getServicePrice"
                          :disabled="((isServiceOrder || isEdit) && !isAdmin)"
                        />
                        <label class="form-check-label" for="onetime"
                          >One Time</label
                        >
                      </div>
                      <div class="form-check form-check-inline">
                        <input
                          class="form-check-input"
                          type="radio"
                          id="monthly"
                          value="monthly"
                          v-model="order.tenure"
                          @change="getServicePrice"
                          :disabled="((isServiceOrder || isEdit) && !isAdmin)"
                        />
                        <label class="form-check-label" for="monthly"
                          >Monthly</label
                        >
                      </div>
                      <div class="form-check form-check-inline">
                        <input
                          class="form-check-input"
                          type="radio"
                          id="quaterly"
                          value="quaterly"
                          v-model="order.tenure"
                          @change="getServicePrice"
                          :disabled="((isServiceOrder || isEdit) && !isAdmin)"
                        />
                        <label class="form-check-label" for="quaterly"
                          >Quaterly</label
                        >
                      </div>
                      <div class="form-check form-check-inline">
                        <input
                          class="form-check-input"
                          type="radio"
                          id="yearly"
                          value="yearly"
                          v-model="order.tenure"
                          @change="getServicePrice"
                          :disabled="((isServiceOrder || isEdit) && !isAdmin)"
                        />
                        <label class="form-check-label" for="yearly"
                          >Yearly</label
                        >
                      </div>
                    </div>
                  </div>
                </div>

                <div class="row mb-4">
                  <div class="col-lg-3">
                    <label for="final_amount" class="form-label"
                      >Final Amount</label
                    >
                  </div>
                  <div class="col-lg-9">
                    <input
                      type="number"
                      class="form-control"
                      id="final_amount"
                      placeholder="Enter Final Amount"
                      v-model="order.final_amount"
                      :disabled="(isServiceOrder || !isAdmin)"
                      :class="{
                        'is-invalid': isSubmited && v$.order.final_amount.$error,
                      }"
                    />
                   <div
                      v-for="(item, index) in v$.order.final_amount.$errors"
                      :key="index"
                      class="invalid-feedback"
                    >
                      <span v-if="item.$message">{{ item.$message }}</span>
                    </div>
                  </div>
                </div>

                <div class="row mb-4" v-if="(!isServiceOrder && isAdmin)">
                  <div class="col-lg-3">
                    <label for="phone" class="form-label">Payment Status</label>
                  </div>
                  <div class="col-lg-9">
                    <div class="mt-4 mt-lg-0">
                      <div class="form-check form-check-inline">
                        <input
                          class="form-check-input"
                          type="radio"
                          id="pending"
                          value="pending"
                          v-model="order.payment_status"
                        />
                        <label class="form-check-label" for="pending"
                          >Pending</label
                        >
                      </div>
                      <div class="form-check form-check-inline">
                        <input
                          class="form-check-input"
                          type="radio"
                          id="received"
                          value="received"
                          v-model="order.payment_status"
                        />
                        <label class="form-check-label" for="received"
                          >Received</label
                        >
                      </div>
                      <div class="form-check form-check-inline">
                        <input
                          class="form-check-input"
                          type="radio"
                          id="failed"
                          value="failed"
                          v-model="order.payment_status"
                        />
                        <label class="form-check-label" for="failed"
                          >Failed</label
                        >
                      </div>
                    </div>
                  </div>
                </div>

                <div class="row mb-4" v-if="(!isServiceOrder && isAdmin)">
                  <div class="col-lg-3">
                    <label for="service_status" class="form-label"
                      >Service Status</label
                    >
                  </div>
                  <div class="col-lg-9">
                    <Multiselect
                      v-model="order.service_status"
                      :close-on-select="true"
                      :searchable="true"
                      :create-option="true"
                      :options="[
                        { value: 'in_progress', label: 'In Progress' },
                        { value: 'complete', label: 'Complete' },
                        { value: 'on_hold', label: 'On Hold' },
                        { value: 'processing', label: 'Processing' },
                      ]"
                    />
                  </div>
                </div>

                <div class="text-start mt-5">
                  <button
                    v-if="(isServiceOrder || isUserOrderAdd)"
                    type="submit"
                    class="align-items-center btn btn-primary d-flex"
                    @click="initPayment"
                    :disabled="disabled"
                  >
                    Add Order
                    <div
                    class="spinner-border loader-setup"
                    role="status"
                    v-if="loader"
                  >
                    <span class="sr-only">Loading...</span>
                  </div>
                  </button>
                  <button
                    v-else
                    type="submit"
                    class="align-items-center btn btn-primary d-flex"
                    @click="saveOrder"
                    :disabled="disabled"
                  >
                    {{isEdit ? 'Update Order' : 'Add Order'}} 
                    <div
                    class="spinner-border loader-setup"
                    role="status"
                    v-if="loader"
                  >
                    <span class="sr-only">Loading...</span>
                  </div>
                  </button>
                </div>
              </div>
              <div class="col-md-6" v-if="(!isServiceOrder && (isAdmin || isEdit))">
                <div
                  class="document"
                  v-if="
                    order.order_documents && order.order_documents.length > 0
                  "
                >
                  <h3 class="mb-4">Order Document</h3>
                  <div
                    class="row mb-4"
                    v-for="(order_doc, index) in order.order_documents"
                    :key="index"
                  >
                    <div class="col-lg-3">
                      <label for="title" class="form-label">{{
                        order_doc.service_documents_name
                      }}</label>
                    </div>
                    <div class="col-lg-7">
                      <input
                        type="file"
                        class="form-control"
                        id="amount"
                        @change="
                          onOrderDocChange(
                            $event,
                            order_doc.service_documents_id
                          )
                        "
                      />
                    </div>
                    <div class="col-lg-2">
                      <a href="javascript:void(0);" class="download-icon"
                        ><i class="ri-download-2-line"></i
                      ></a>
                    </div>
                  </div>
                </div>

                <div class="history" v-if="commentsData.length > 0">
                  <h3 class="mb-2">Comment History</h3>
                  <div class="card-body px-0">
                    <div class="table-responsive table-bordered">
                      <table class="table align-middle table-nowrap mb-0">
                        <thead>
                          <tr>
                            <th scope="col">Date</th>
                            <th scope="col">Comment</th>
                            <th scope="col">Attachment</th>
                            <th scope="col">User</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr
                            v-for="(comment, index) in commentsData"
                            :key="index"
                          >
                            <td>{{ getDate(comment.created_at) }}</td>
                            <td>{{ comment.notes }}</td>
                            <td>Download</td>
                            <td>
                              {{
                                comment.user && comment.user.name
                                  ? comment.user.name
                                  : "-"
                              }}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>

                <div class="root-comment-div" v-if="order.id != null">
                  <div class="row mb-3 mt-4">
                    <div class="col-8">
                      <h3>Add Comment</h3>
                    </div>
                    <div class="col-4">
                      <input
                        type="file"
                        class="form-control"
                        id="attchment"
                        @change="onAttechmentChange($event)"
                      />
                    </div>
                  </div>
                  <div class="add-comment">
                    <textarea
                      class="form-control"
                      v-model="comment.notes"
                      :class="{
                        'is-invalid': v$.comment.notes.$error,
                      }"
                    ></textarea>
                    <div
                      v-for="(item, index) in v$.comment.notes.$errors"
                      :key="index"
                      class="invalid-feedback"
                    >
                      <span v-if="item.$message">{{ item.$message }}</span>
                    </div>
                  </div>
                  <div class="d-flex justify-content-end mt-3">
                    <div class="form-check mt-2 me-3">
                      <input
                        class="form-check-input"
                        type="checkbox"
                        value=""
                        id="send-email-checkbox"
                        v-model="comment.is_send_email"
                      />
                      <label class="form-check-label" for="send-email-checkbox"
                        >Send Email</label
                      >
                    </div>

                    <div class="form-check mt-2 me-3">
                      <input
                        class="form-check-input"
                        type="checkbox"
                        value=""
                        id="note-checkbox"
                        v-model="comment.is_personal_note"
                      />
                      <label class="form-check-label" for="note-checkbox"
                        >Private Note</label
                      >
                    </div>

                    <button
                      type="submit"
                      class="btn btn-primary"
                      @click="addAttechmemt"
                    >
                      Add
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!-- end card-body -->
        </div>
        <!-- end card -->
      </div>
      <!-- end col -->

      <!-- end col -->
          <CheckoutProvider :config="config" v-if="showPaytm" :openInPopup="openInPopup" env="STAGE">
              <Checkout v-if="showPaytm"/>
        </CheckoutProvider>
    </div>
  </Layout>
</template>
<style scoped>
.download-icon {
  color: #000000;
  font-size: 30px;
}
</style>