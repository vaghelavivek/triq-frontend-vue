<script>
import Layout from "../../../layouts/main.vue";
import PageHeader from "@/components/page-header";

import "prismjs";
import "prismjs/themes/prism.css";

export default {
  data() {
    return {
      title: "Add User",
    };
  },
  components: {
    Layout,
    PageHeader,
  },
  mounted() {},
};
</script>

<template>
  <Layout>
    <PageHeader :title="title" />
    <div class="row">
      <div class="col-xl-12">
        <div class="card">
          <div class="card-header align-items-center d-flex">
            <h4 class="card-title mb-0 flex-grow-1">Add User</h4>
          </div>
          <!-- end card header -->

          <div class="card-body">
            <div class="row">
              <div class="col-6">
                <div class="row mb-4">
                  <div class="col-lg-3">
                    <label for="nameInput" class="form-label">Name</label>
                  </div>
                  <div class="col-lg-9">
                    <input
                      type="text"
                      class="form-control"
                      id="nameInput"
                      placeholder="Enter your name"
                    />
                  </div>
                </div>
                <div class="row mb-4">
                  <div class="col-lg-3">
                    <label for="leaveemails" class="form-label">Email</label>
                  </div>
                  <div class="col-lg-9">
                    <input
                      type="email"
                      class="form-control"
                      id="leaveemails"
                      placeholder="Enter your email"
                    />
                  </div>
                </div>
                <div class="row mb-4">
                  <div class="col-lg-3">
                    <label for="phone" class="form-label">Phone</label>
                  </div>
                  <div class="col-lg-9">
                    <input
                      type="text"
                      class="form-control"
                      id="phone"
                      placeholder="Enter your phone"
                    />
                  </div>
                </div>

                <div class="row mb-4">
                  <div class="col-lg-3">
                    <label for="phone" class="form-label">Language</label>
                  </div>
                  <div class="col-lg-9">
                    <div class="mt-4 mt-lg-0">
                      <div class="form-check form-check-inline">
                        <input
                          class="form-check-input"
                          type="radio"
                          name="inlineRadioOptions1"
                          id="lang-english"
                          value="english"
                        />
                        <label class="form-check-label" for="lang-english"
                          >English</label
                        >
                      </div>
                      <div class="form-check form-check-inline">
                        <input
                          class="form-check-input"
                          type="radio"
                          name="inlineRadioOptions2"
                          id="lang-arabic"
                          value="arabic"
                        />
                        <label class="form-check-label" for="lang-arabic"
                          >Arabic</label
                        >
                      </div>
                    </div>
                  </div>
                </div>

                <div class="row mb-4">
                  <div class="col-lg-3">
                    <label for="password" class="form-label">Password</label>
                  </div>
                  <div class="col-lg-9">
                    <input
                      type="password"
                      class="form-control"
                      id="password"
                      placeholder="Enter your Password"
                    />
                  </div>
                </div>

                <div class="row mb-4">
                  <div class="col-lg-3">
                    <label for="business_name" class="form-label"
                      >Business Name</label
                    >
                  </div>
                  <div class="col-lg-9">
                    <input
                      type="text"
                      class="form-control"
                      id="business_name"
                      placeholder="Enter Business Name"
                    />
                  </div>
                </div>
              </div>

              <div class="col-6">
               
                <div class="row mb-4">
                  <div class="col-lg-3">
                    <label for="phone" class="form-label">Role</label>
                  </div>
                  <div class="col-lg-9">
                    <div class="mt-4 mt-lg-0">
                      <div class="form-check form-check-inline">
                        <input
                          class="form-check-input"
                          type="radio"
                          name="inlineRadioOptions1"
                          id="super-admin"
                          value="super-admin"
                        />
                        <label class="form-check-label" for="super-admin"
                          >Super Admin</label
                        >
                      </div>
                      <div class="form-check form-check-inline">
                        <input
                          class="form-check-input"
                          type="radio"
                          name="inlineRadioOptions2"
                          id="team"
                          value="team"
                        />
                        <label class="form-check-label" for="team"
                          >Team</label
                        >
                      </div>
                      <div class="form-check form-check-inline">
                        <input
                          class="form-check-input"
                          type="radio"
                          name="inlineRadioOptions2"
                          id="user"
                          value="user"
                        />
                        <label class="form-check-label" for="user"
                          >User</label
                        >
                      </div>
                    </div>
                  </div>
                </div>

                <div class="row mb-4">
                  <div class="col-lg-3">
                    <label for="address" class="form-label">Address</label>
                  </div>
                  <div class="col-lg-9">
                    <textarea class="form-control" id="address" rows="3" placeholder="Enter your address"></textarea>
                  </div>
                </div>

                <div class="row mb-4">
                  <div class="col-lg-3">
                    <label for="city" class="form-label"
                      >City</label
                    >
                  </div>
                  <div class="col-lg-9">
                    <input
                      type="text"
                      class="form-control"
                      id="city"
                      placeholder="Enter City"
                    />
                  </div>
                </div>

                <div class="row mb-4">
                  <div class="col-lg-3">
                    <label for="state" class="form-label"
                      >State</label
                    >
                  </div>
                  <div class="col-lg-9">
                    <input
                      type="text"
                      class="form-control"
                      id="state"
                      placeholder="Enter State"
                    />
                  </div>
                </div>

                <div class="row mb-4">
                  <div class="col-lg-3">
                    <label for="zipcode" class="form-label"
                      >Zip</label
                    >
                  </div>
                  <div class="col-lg-9">
                    <input
                      type="text"
                      class="form-control"
                      id="zipcode"
                      placeholder="Enter Zip"
                    />
                  </div>
                </div>
                <div class="row mb-4">
                  <div class="col-lg-3">
                    <label for="country" class="form-label"
                      >Country</label
                    >
                  </div>
                  <div class="col-lg-9">
                    <input
                      type="text"
                      class="form-control"
                      id="country"
                      placeholder="Enter Country"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div class="text-end"><button type="submit" class="btn btn-primary"> Add User </button></div>
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
