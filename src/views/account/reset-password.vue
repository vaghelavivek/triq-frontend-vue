<script>
import appConfig from "../../../app.config";

import { required, email, helpers, sameAs} from "@vuelidate/validators";
import useVuelidate from "@vuelidate/core";
// import Lottie from "@/components/widgets/lottie.vue";
import {mapActions} from 'vuex'
import animationData from "@/components/widgets/rhvddzym.json";
export default {
  setup() {
    return { v$: useVuelidate() };
  },
  validations(){
    return {
        user:{
            email: {
                required: helpers.withMessage("Email is required", required),
                email: helpers.withMessage("Please enter valid email", email),
            },
            password: {
                required: helpers.withMessage("Password is required", required),
            },
            confirm_password: {
               sameAsPassword: sameAs(this.user.password),
            },
        }
    };
  },
  page: {
    title: "Reset Password",
    meta: [
      {
        name: "description",
        content: appConfig.description,
      },
    ],
  },
  data() {
    return {
      user:{
        email: null,
        password: null,
        confirm_password: null,
        token: null,
      },
      submitted: false,
      error: null,
      tryingToReset: false,
      isResetError: false,
      defaultOptions: { animationData: animationData },
      loader:false,
      disabled:false,
      showpass: true,
      cshowpass: true,
    };
  },
  methods: {
    ...mapActions({
      resetPasswordDb:'auth/resetPassword'
    }),
    // Try to register the user in with the email, fullname
    // and password they provided.
    resetPassword() {
      this.submitted = true;
      // stop here if form is invalid
      this.v$.$touch();

      if (this.v$.$invalid) {
        return;
      } else {
        this.loader=true
        this.disabled=true
        this.resetPasswordDb(this.user).then((res)=>{
        this.loader=false
        this.disabled=false
        if(res.data.status){
             this.$toast.open({
              message: "Password has been changed successfully.",
              type: "success",
            })
        this.$router.push({name:"login"})
        }else{
          let message=res.data.message
          this.$toast.open({
              message: message,
              type: "error",
            })
        }
      }).catch(()=>{
        this.loader=false
        this.disabled=false
        this.$toast.open({
              message: 'Server Error',
              type: "error",
            })  
      })
      }
    },
  },
 mounted() {
    if (this.$route.query) {
      this.user.email = this.$route.query.email;
      this.user.token = this.$route.query.token;
    }
  },
};
</script>

<template>
  <div class="auth-page-wrapper pt-5">
    <!-- auth page bg -->
    <div class="auth-one-bg-position auth-one-bg" id="auth-particles">
      <div class="bg-overlay"></div>

      <div class="shape">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          version="1.1"
          xmlns:xlink="http://www.w3.org/1999/xlink"
          viewBox="0 0 1440 120"
        >
          <path
            d="M 0,36 C 144,53.6 432,123.2 720,124 C 1008,124.8 1296,56.8 1440,40L1440 140L0 140z"
          ></path>
        </svg>
      </div>
    </div>

    <!-- auth page content -->
    <div class="auth-page-content">
      <div class="container">
        <div class="row">
          <div class="col-lg-12">
            <div class="text-center mt-sm-5 mb-4 text-white-50">
              <div>
                <router-link to="/" class="d-inline-block auth-logo">
                  <img src="@/assets/images/triq-logo.png" alt="" height="50" />
                </router-link>
              </div>
              <p class="mt-3 fs-15 fw-medium">
                E-TRIQ Reset Password
              </p>
            </div>
          </div>
        </div>
        <!-- end row -->

        <div class="row justify-content-center">
          <div class="col-md-8 col-lg-6 col-xl-5">
            <div class="card mt-4">
              <div class="card-body p-4">
                <div class="text-center mt-2">
                  <h5 class="text-primary">Reset Password</h5>
                  <p class="text-muted">Please reset your password to login your account</p>
                </div>

                <div class="p-2">
                  <b-alert
                    v-model="isResetError"
                    class="mb-4"
                    variant="danger"
                    dismissible
                    >{{ error }}</b-alert
                  >
                  <form @submit.prevent="resetPassword" novalidate>
                    <div class="mb-3">
                      <label class="form-label">Email</label>
                      <input
                        type="email"
                        v-model="user.email"
                        class="form-control"
                        id="email"
                        :class="{ 'is-invalid': submitted && v$.user.email.$errors.length }"
                        placeholder="Enter Email"
                      />
                      <div
                        v-for="(item, index) in v$.user.email.$errors"
                        :key="index"
                        class="invalid-feedback"
                      >
                        <span v-if="item.$message">{{ item.$message }}</span>
                      </div>
                    </div>
                    <div class="mb-3">
                      <label class="form-label" for="password-input"
                        >Password<span class="text-danger">*</span></label
                      >
                      <div class="position-relative auth-pass-inputgroup mb-3">
                        <input
                          :type="showpass ? 'password' : 'text'"
                          v-model="user.password"
                          class="form-control pe-5"
                          placeholder="Enter password"
                          id="password-input"
                          ref="password"
                          :class="{
                            'is-invalid': submitted && v$.user.password.$error,
                          }"
                        />
                        <button
                          class="
                            btn btn-link
                            position-absolute
                            end-0
                            top-0
                            text-decoration-none text-muted
                          "
                          type="button"
                          id="password-addon"
                        >
                          <i
                            class="ri-eye-line align-middle"
                            v-if="!showpass"
                            @click="showpass = true"
                          ></i>
                          <i
                            class="ri-eye-off-line align-middle"
                            v-if="showpass"
                            @click="showpass = false"
                          ></i>
                        </button>
                        <div
                          v-for="(item, index) in v$.user.password.$errors"
                          :key="index"
                          class="invalid-feedback"
                        >
                          <span v-if="item.$message">{{ item.$message }}</span>
                        </div>
                      </div>
                    </div>
                    <div class="mb-3">
                      <label class="form-label" for="password-input"
                        >Confirm Password<span class="text-danger"
                          >*</span
                        ></label
                      >
                      <div class="position-relative auth-pass-inputgroup mb-3">
                        <input
                          :type="cshowpass ? 'password' : 'text'"
                          v-model="user.confirm_password"
                          class="form-control pe-5"
                          placeholder="Enter password"
                          id="password-input"
                          :class="{
                            'is-invalid':
                              submitted && v$.user.confirm_password.$error,
                          }"
                        />
                        <button
                          class="
                            btn btn-link
                            position-absolute
                            end-0
                            top-0
                            text-decoration-none text-muted
                          "
                          type="button"
                          id="password-addon"
                        >
                          <i
                            class="ri-eye-line align-middle"
                            v-if="!cshowpass"
                            @click="cshowpass = true"
                          ></i>
                          <i
                            class="ri-eye-off-line align-middle"
                            v-if="cshowpass"
                            @click="cshowpass = false"
                          ></i>
                        </button>
                        <div
                          v-for="(item, index) in v$.user.confirm_password
                            .$errors"
                          :key="index"
                          class="invalid-feedback"
                        >
                          <span v-if="item.$message">{{ item.$message }}</span>
                        </div>
                      </div>
                    </div>
                    <div class="text-center mt-4">
                      <button class="btn btn-success w-100 align-items-center d-flex justify-content-center" :disabled="disabled" type="submit">
                            Reset Password
                            <div class="spinner-border loader-setup" role="status" v-if="loader">
                              <span class="sr-only">Loading...</span>
                            </div>
                          </button>
                    </div>
                  </form>
                  <!-- end form -->
                </div>
              </div>
              <!-- end card body -->
            </div>
            <!-- end card -->

            <div class="mt-4 text-center">
              <p class="mb-0">
                Wait, I remember my password...
                <router-link
                  to="/login"
                  class="fw-semibold text-primary text-decoration-underline"
                >
                  Click here
                </router-link>
              </p>
            </div>
          </div>
        </div>
        <!-- end row -->
      </div>
      <!-- end container -->
    </div>
    <!-- end auth page content -->

    <!-- footer -->
    <footer class="footer">
      <div class="container">
        <div class="row">
          <div class="col-lg-12">
            <div class="text-center">
              <p class="mb-0 text-muted">
                &copy; {{ new Date().getFullYear() }} E-TRIQ.
              </p>
            </div>
          </div>
        </div>
      </div>
    </footer>
    <!-- end Footer -->
  </div>
  <!-- end auth-page-wrapper -->
</template>
