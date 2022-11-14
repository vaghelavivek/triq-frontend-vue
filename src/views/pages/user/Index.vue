<script>
import Layout from "../../../layouts/main.vue";
import PageHeader from "@/components/page-header";
import Multiselect from "@vueform/multiselect";
import "@vueform/multiselect/themes/default.css";
import {mapActions,mapGetters} from 'vuex'
import "prismjs";
import "prismjs/themes/prism.css";
import moment from "moment";
import Swal from "sweetalert2";
export default {
  data() {
    return {
      title: "Users",
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
  computed:{
    ...mapGetters({
      getUsers:'users/getUsers'
    }),
    displayedPosts() {
        return this.paginate(this.getUsers);
      },
      resultQuery() {
        if (this.selectedCountry) {
          const search = this.selectedCountry.toLowerCase();
          return this.displayedPosts.filter(user => user.country === search)
        } else {
          return this.displayedPosts;
        }
  }
  },
  methods:{
    ...mapActions({
        fetchUsers:'users/fetchUsers',
        deleteUser:'users/deleteUser',
    }),
    getAllUsers(page){
      this.fetchUsers(page)
    },
    setPages() {
      let numberOfPages = Math.ceil(this.getUsers.length / this.perPage);
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
    getDate(date) {
      return moment(date).format("MM/DD/YYYY");
    },
    deleteUserData(user) {
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
          this.deleteUser(user)
            .then(() => {
                this.$toast.open({
                  message: "User Deleted.",
                  type: "success",
                })
            })
            .catch(() => {
              Swal.fire("Oops...", "Something went wrong", "error");
            });
        }
      });
    },
    editUser(id){
       this.$router.push({
            name: 'EditUser',
            params: {id: id},
          });
    }
  },
  async mounted() {
    this.getAllUsers()
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
                to="/admin/users/add"
                class="btn btn-primary waves-effect waves-light"
              >
                Add User
              </router-link>
            </div>
          </div>
          <!-- end card header -->

          <div class="card-body">
            <div class="table-responsive table-card">
              <table class="table align-middle table-nowrap" id="customerTable">
                <thead class="table-light text-muted">
                  <tr>
                    <th class="sort" data-sort="currency_name" scope="col">ID</th>
                    <th class="sort" data-sort="current_value" scope="col">
                      Name
                    </th>
                    <th class="sort" data-sort="pairs" scope="col">Email</th>
                    <th class="sort" data-sort="high" scope="col">Role</th>
                    <th class="sort" data-sort="low" scope="col">Phone</th>
                    <th class="sort" data-sort="low" scope="col">Date</th>
                    <th class="sort" data-sort="market_cap" scope="col">
                      Country
                    </th>
                    <th scope="col">Action</th>
                  </tr>
                </thead>
                <!--end thead-->
                <tbody class="list form-check-all">
                  <tr v-for="(data, index) of resultQuery" :key="index">
                    <td class="id">
                      {{ data.id }}
                    </td>
                    <td>{{ data.name }}</td>
                    <td class="pairs">{{ data.email }}</td>
                    <td class="high">{{ data.role_id == 1 ? 'Super Admin' :  data.role_id == 2 ? 'Team' : 'User'}}</td>
                    <td class="low">{{ data.phone }}</td>
                    <td>{{ getDate(data.created_at) }}</td>
                    <td class="market_cap">{{ data.country }}</td>
                    <td>
                      <div class="hstack gap-3 flex-wrap">
                        <a href="javascript:void(0);" @click="editUser(data.id)" class="link-success fs-15"
                          ><i class="ri-edit-2-line"></i></a
                        ><a
                          href="javascript:void(0);"
                          @click="deleteUserData(data)"
                          class="link-danger fs-15"
                          ><i class="ri-delete-bin-line"></i
                        ></a>
                      </div>
                    </td>
                  </tr>
                </tbody>
                <!--end tbody-->
              </table>
            </div>
              <div class="d-flex justify-content-end mt-3">
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
