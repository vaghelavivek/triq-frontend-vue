<script>
import Layout from "../../../layouts/main.vue";
import PageHeader from "@/components/page-header";
import Multiselect from "@vueform/multiselect";
import "@vueform/multiselect/themes/default.css";

import "prismjs";
import "prismjs/themes/prism.css";

export default {
  data() {
    return {
      title: "Users",
      selectedCountry: "india",
    };
  },
  components: {
    Layout,
    PageHeader,
    Multiselect,
  },
  mounted() {},
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
                  { value: 'arabic', label: 'Arabic' },
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
            <h4 class="card-title mb-0 flex-grow-1">Users</h4>
            <div class="flex-shrink-0">
              <router-link
                to="/users/add"
                class="btn btn-primary waves-effect waves-light"
              >
                Add User
              </router-link>
            </div>
          </div>
          <!-- end card header -->

          <div class="card-body">
            <div class="table-responsive">
              <table class="table align-middle table-nowrap mb-0">
                <thead>
                  <tr>
                    <th scope="col">Date</th>
                    <th scope="col">Name</th>
                    <th scope="col">Email</th>
                    <th scope="col">Phone</th>
                    <th scope="col">Country</th>
                    <th scope="col">Action</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>01-01-22</td>
                    <td>Bobby Davis</td>
                    <td>bobbydavis@gmail.com</td>
                    <td>7894561230</td>
                    <td>India</td>
                    <td>
                      <a href="javascript:void(0);" class="link-success"
                        >View Details
                        <i class="ri-arrow-right-line align-middle"></i
                      ></a>
                    </td>
                  </tr>
                  <tr>
                    <td>02-01-22</td>
                    <td>Hello World</td>
                    <td>helloworld@gmail.com</td>
                    <td>7894561230</td>
                    <td>India</td>
                    <td>
                      <a href="javascript:void(0);" class="link-success"
                        >View Details
                        <i class="ri-arrow-right-line align-middle"></i
                      ></a>
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
