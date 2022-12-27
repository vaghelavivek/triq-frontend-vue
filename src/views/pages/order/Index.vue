<script>
import Layout from "../../../layouts/main.vue";
import PageHeader from "@/components/page-header";
import Multiselect from "@vueform/multiselect";
import "@vueform/multiselect/themes/default.css";

import "prismjs";
import "prismjs/themes/prism.css";
import { mapActions, mapGetters } from "vuex";
import moment from "moment";
import Swal from "sweetalert2";

export default {
  data() {
    return {
      title: "Orders",
      selectedCountry: "india",
    };
  },
  components: {
    Layout,
    PageHeader,
    Multiselect,
  },
  computed: {
    ...mapGetters({
      getOrders: "order/getOrders",
      userData: "auth/user",
    }),
  },
  mounted() {
    this.setOrders();
  },
  methods: {
    ...mapActions({
      setOrders: "order/setOrders",
      deleteOrder: "order/deleteOrder",
    }),
    getDate(date) {
      return moment(date).format("MM/DD/YY");
    },
    deleteOrderData(id) {
      Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        cancelButtonColor: "#f46a6a",
        confirmButtonColor: "#34c38f",
        confirmButtonText: "Yes, delete it!",
      }).then((result) => {
        if (result.value) {
          this.deleteOrder(id)
            .then((response) => {
              console.log(response);
            })
            .catch(() => {
              Swal.fire("Oops...", "Something went wrong", "error");
            });
        }
      });
    },
    editOrderData(orderId){
      if(this.userData && this.userData.role_id != 3){
        this.$router.push({
          name: 'EditOrder',
          params: {
            id: btoa(orderId)
          },
        });
      }else{
        this.$router.push({
          name: 'UserOrderEdit',
          params: {
            id: btoa(orderId)
          },
        });
      }
    },
    addOrderRedirect(){
       if(this.userData && this.userData.role_id != 3){
        this.$router.push({
          name: 'AddOrder'
        });
      }else{
        this.$router.push({
          name: 'UserOrderAdd'
        });
      }
    }
  },
};
</script>

<template>
  <Layout>
    <PageHeader :title="title" />
    <div class="row">
      <div class="col-xl-12">
        <div class="filter">
          <div class="row">
            <div class="col-3">
              <Multiselect
                v-model="selectedCountry"
                :close-on-select="true"
                :searchable="true"
                :create-option="true"
                :options="[
                  { value: 'india', label: 'India' },
                  { value: 'Uae', label: 'UAE' },
                ]"
              />
            </div>
            <div class="col-9 d-flex justify-content-end">
              <b-button
                variant="primary"
                class="btn btn-primary waves-effect waves-light"
                >Filter</b-button
              >
            </div>
          </div>
        </div>

        <div class="card mt-4">
          <div class="card-header align-items-center d-flex">
            <h4 class="card-title mb-0 flex-grow-1">Orders</h4>
            <div class="flex-shrink-0">
              <!-- <router-link
                to="/admin/order/add"
                class="btn btn-primary waves-effect waves-light"
              >
                Add Order
              </router-link> -->
              <button class="btn btn-primary waves-effect waves-light" @click="addOrderRedirect">Add Order</button>
            </div>
          </div>
          <!-- end card header -->
          <div class="card-body">
            <div class="table-responsive">
              <table class="table align-middle table-nowrap mb-0">
                <thead>
                  <tr>
                    <th scope="col">Date</th>
                    <th scope="col" v-if="(userData && userData.role_id != 3)">User</th>
                    <th scope="col">Service</th>
                    <th scope="col">Order Status</th>
                    <th scope="col">Payment Status</th>
                    <th scope="col">Assigned User</th>
                    <th scope="col">Action</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(order, index) in getOrders" :key="index">
                    <td>{{ getDate(order.created_at) }}</td>
                    <td v-if="(userData && userData.role_id != 3)">{{ order.user && order.user.name ? order.user.name : '' }}</td>
                    <td>{{ order.service && order.service.title ? order.service.title : ''  }}</td>
                    <td>{{ order.service_status }}</td>
                    <td>{{ order.payment_status }}</td>
                    <td>{{ order.assigned_user }}</td>
                    <td>
                      <div class="hstack gap-3 flex-wrap">
                        <a class="link-success fs-15" @click="editOrderData(order.id)"><i class="ri-edit-2-line"></i></a>
                        <!-- <router-link class="link-success fs-15" :to="{name: 'EditOrder',params: { id: order.id },}"
                          ><i class="ri-edit-2-line"></i></router-link> -->
                        <a
                          href="javascript:void(0);"
                          @click="deleteOrderData(order.id)"
                          class="link-danger fs-15"
                          ><i class="ri-delete-bin-line"></i
                        ></a>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
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
