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
      title: "Service",
      selectedCountry: "",
      page: 1,
      perPage: 10,
      pages: [],
    };
  },
  components: {
    Layout,
    PageHeader,
    Multiselect,
  },
  computed: {
    ...mapGetters({
      getServices: "service/getServices",
    }),
    displayedPosts() {
        return this.paginate(this.getServices);
      },
    resultQuery() {
      if (this.selectedCountry) {
        const search = this.selectedCountry.toLowerCase();
        return this.displayedPosts.filter(user => user.country === search)
      } else {
        return this.displayedPosts;
      }
    },
  },
  async mounted() {
    await this.setServices();
    await this.setPages()
  },
  methods: {
    ...mapActions({
      setServices: "service/setServices",
      deleteService: "service/deleteService",
    }),
    getDate(date) {
      return moment(date).format("MM/DD/YY");
    },
    deleteServiceData(id) {
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
          this.deleteService(id)
            .then(() => {
                this.$toast.open({
                  message: "Service Deleted.",
                  type: "success",
                })
            })
            .catch(() => {
              Swal.fire("Oops...", "Something went wrong", "error");
            });
        }
      });
    },
    setPages() {
      let numberOfPages = Math.ceil(this.getServices.length / this.perPage);
      for (let index = 1; index <= numberOfPages; index++) {
        this.pages.push(index);
      }
    },
    paginate(data) {
      let page = this.page;
      let perPage = this.perPage;
      let from = page * perPage - perPage;
      let to = page * perPage;
      return data.slice(from, to);
    },
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
                  { value: 'uae', label: 'UAE' },
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
            <h4 class="card-title mb-0 flex-grow-1">Services</h4>
            <div class="flex-shrink-0">
              <router-link
                to="/admin/services/add"
                class="btn btn-primary waves-effect waves-light"
              >
                Add Service
              </router-link>
            </div>
          </div>
          <!-- end card header -->

          <div class="card-body">
            <div class="table-responsive table-card">
              <table class="table align-middle table-nowrap mb-0">
                <thead>
                  <tr>
                    <th scope="col">Date</th>
                    <th scope="col">Title</th>
                    <th scope="col">Price</th>
                    <th scope="col">Country</th>
                    <th scope="col">Action</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(service, index) in resultQuery" :key="index">
                    <td>{{ getDate(service.created_at) }}</td>
                    <td>{{ service.title }}</td>
                    <td>{{ service.price }}</td>
                    <td class="text-capitalize">{{ service.country }}</td>
                    <!-- <td>
                      <a href="javascript:void(0);" class="link-success"
                        >View Details
                        <i class="ri-arrow-right-line align-middle"></i
                      ></a>
                    </td> -->
                    <td>
                      <div class="hstack gap-3 flex-wrap">
                        <router-link class="link-success fs-15" :to="{name: 'EditService',params: { id: service.id },}"
                          ><i class="ri-edit-2-line"></i></router-link>
                        <a
                          href="javascript:void(0);"
                          @click="deleteServiceData(service.id)"
                          class="link-danger fs-15"
                          ><i class="ri-delete-bin-line"></i
                        ></a>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div class="d-flex justify-content-end pt-4">
                <div class="pagination-wrap hstack gap-2">
                  <a class="page-item pagination-prev disabled" href="#" v-if="page != 1" @click="page--">
                    Previous
                  </a>
                  <ul class="pagination listjs-pagination mb-0">
                    <li :class="{
                                  active: pageNumber == page,
                                  disabled: pageNumber == '...',
                                }" v-for="(pageNumber, index) in pages.slice(page - 1, page + 5)" :key="index"
                      @click="page = pageNumber">
                      <a class="page" href="#">{{ pageNumber }}</a>
                    </li>
                  </ul>
                  <a class="page-item pagination-next" href="#" @click="page++" v-if="page < pages.length">
                    Next
                  </a>
                </div>
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
