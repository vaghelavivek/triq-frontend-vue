<script>
import Layout from "../../../layouts/main.vue";
import PageHeader from "@/components/page-header";
import Multiselect from "@vueform/multiselect";
import "@vueform/multiselect/themes/default.css";

import "prismjs";
import "prismjs/themes/prism.css";
import { required, helpers } from "@vuelidate/validators";
import useVuelidate from "@vuelidate/core";
import { mapActions, mapGetters } from "vuex";

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
        amount: null,
        tax: null,
        final_amount: null,
        payment_status: "received",
        service_status: "processing",
        order_documents: [],
      },
      isSubmited: false,
      servicesData: [],
      usersData: [],
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
    },
  },
  components: {
    Layout,
    PageHeader,
    Multiselect,
  },
  computed: {
    ...mapGetters({
      userData: "auth/user",
      getUsers: "users/getUsers",
    }),
  },
  mounted() {
    if (this.$route.name == "EditService" && this.$route.params.id) {
      this.getOrderData(this.$route.params.id);
    }
    if (this.userData && this.userData.role_id == 3) {
      this.getServicesByUserData();
    }
    this.setupUserData();
  },
  methods: {
    ...mapActions({
      addOrder: "order/addOrder",
      getOrderById: "order/getOrderById",
      getServicesByUser: "service/getServicesByUser",
      getServiceById: "service/getServiceById",
    }),
    clearOrder() {
      this.order = {
        id: null,
        user_id: null,
        service_id: null,
        amount: null,
        tax: null,
        final_amount: null,
        payment_status: "received",
        service_status: "processing",
        order_documents: [],
      };
    },
    saveOrder() {
      this.isSubmited = true;
      this.v$.$touch();
      if (this.v$.$invalid) {
        return;
      }
      var formdata = new FormData();
      formdata.append("id", this.order.id);
      formdata.append("user_id", this.order.user_id);
      formdata.append("service_id", this.order.service_id);
      formdata.append("amount", this.order.amount);
      formdata.append("tax", this.order.tax);
      formdata.append("final_amount", this.order.final_amount);
      formdata.append("payment_status", this.order.payment_status);
      formdata.append("service_status", this.order.service_status);
      formdata.append(
        "order_documents",
        JSON.stringify(this.order.order_documents)
      );
      this.addOrder(formdata)
        .then((res) => {
          if (res.data.status) {
            this.isSubmited = false;
            this.clearOrder();
            this.$toast.success("Order added Successfully");
            this.$router.push({ name: "Services" });
          }
        })
        .catch((error) => {
          console.log("error", error);
        });
    },
    // addDocument() {
    //   var doc = {
    //     id: null,
    //     name: null,
    //   };
    //   this.service.document_names.push(doc);
    // },
    // removeDocument(index) {
    //   this.service.document_names.splice(index, 1);
    // },
    getOrderData(orderId) {
      this.getOrderById(orderId)
        .then((res) => {
          console.log(res);
          // if (res.data.status) {
          //   let service = res.data.data.service;
          //   let serviceDocument = service.service_document;
          //   this.service = {
          //     id: service.id,
          //     title: service.title,
          //     description: service.description,
          //     country: service.country,
          //     image: service.service_image,
          //     price: service.price,
          //     tenure: service.tenure,
          //   };
          //   var nameDocument = []
          //   serviceDocument.map((doc) => {
          //     var docData = {
          //       id: doc.id,
          //       name: doc.name,
          //     };
          //     nameDocument.push(docData);
          //   });
          //   this.service.document_names = nameDocument
          //   console.log('nameDocument',nameDocument)
          // } else {
          //   this.$router.push({ name: "AddService" });
          // }
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
      this.getUsers.map((user) => {
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
            let serviceDocument = service.service_document;
            var nameDocument = [];
            serviceDocument.map((doc) => {
              var docData = {
                service_documents_id: doc.id,
                service_documents_name: doc.name,
                uploaded_file: null,
              };
              nameDocument.push(docData);
            });
            this.order.order_documents = nameDocument;
          }
        })
        .catch((e) => {
          console.log(e);
        });
    },
    onOrderDocChange(e,service_documents_id){
      const file = e.target.files[0];
      if (file) {
        var fileUrl = URL.createObjectURL(file);
        this.order.order_documents.map((order_doc) =>{
          if(order_doc.service_documents_id == service_documents_id){
            order_doc.uploaded_file = fileUrl
          }
        })
      }
    }
  },
};
</script>

<template>
  <Layout>
    <PageHeader />
    <!-- {{ addService }} -->
    <div class="row">
      <div class="col-xl-12">
        <div class="card">
          <div class="card-header align-items-center d-flex">
            <h4 class="card-title mb-0 flex-grow-1">Add Order</h4>
          </div>
          {{ order.order_documents }}
          <!-- end card header -->
          <div class="card-body">
            <div class="row">
              <div class="col-md-6">
                <h3 class="mb-4">Order Detail</h3>
                <div class="row mb-4">
                  <div class="col-lg-3">
                    <label for="title" class="form-label"
                      >User Name {{ order.user_id }}</label
                    >
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
                    />
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
                      @select="getServiceDocumentData"
                    />
                  </div>
                </div>

                <div class="row mb-4">
                  <div class="col-lg-3">
                    <label for="amount" class="form-label">Amount</label>
                  </div>
                  <div class="col-lg-9">
                    <input
                      type="number"
                      class="form-control"
                      id="amount"
                      placeholder="Enter Amount"
                      v-model="order.amount"
                    />
                  </div>
                </div>

                <div class="row mb-4">
                  <div class="col-lg-3">
                    <label for="tax" class="form-label">Tax</label>
                  </div>
                  <div class="col-lg-9">
                    <input
                      type="number"
                      class="form-control"
                      id="tax"
                      placeholder="Enter Tax"
                      v-model="order.tax"
                    />
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
                    />
                  </div>
                </div>

                <div class="row mb-4">
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

                <div class="row mb-4">
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
                        { value: 'complate', label: 'Complete' },
                        { value: 'on_hold', label: 'On Hold' },
                        { value: 'processing', label: 'Processing' },
                      ]"
                    />
                  </div>
                </div>
              </div>
              <div class="col-md-6">
                <h3 class="mb-4">Order Document</h3>
                <div class="row mb-4" v-for="(order_doc,index) in order.order_documents" :key="index">
                  <div class="col-lg-3">
                    <label for="title" class="form-label">{{order_doc.service_documents_name}}</label>
                  </div>
                  <div class="col-lg-7">
                    <input type="file" class="form-control" id="amount" @change="onOrderDocChange($event,order_doc.service_documents_id)"/>
                  </div>
                  <div class="col-lg-2">
                    <a href="javascript:void(0);" class="download-icon"
                      ><i class="ri-download-2-line"></i
                    ></a>
                  </div>
                </div>
              </div>
            </div>

            <div class="text-end">
              <button type="submit" class="btn btn-primary" @click="saveOrder">
                Add Order
              </button>
            </div>
          </div>
          <!-- end card-body -->
        </div>
        <!-- end card -->
      </div>
      <!-- end col -->

      <!-- end col -->
    </div>

    <!--end row-->
  </Layout>
</template>
<style scoped>
.download-icon {
  color: #000000;
  font-size: 30px;
}
</style>