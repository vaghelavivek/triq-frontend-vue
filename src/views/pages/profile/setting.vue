<script>


  import Layout from "../../../layouts/main.vue";
  import appConfig from "../../../../app.config";
  import { mapActions, mapGetters, mapState } from 'vuex';
  import Multiselect from "@vueform/multiselect";
import "@vueform/multiselect/themes/default.css";
  import moment from "moment";
  import {
  required,
  email,
  helpers,
  numeric
} from "@vuelidate/validators";
import useVuelidate from "@vuelidate/core";

  export default {
    setup() {
      return { v$: useVuelidate() };
    },
    page: {
      title: "Setting",
      meta: [{
        name: "description",
        content: appConfig.description
      }],
    },
    data() {
      return {
        title: "Setting",
        items: [{
            text: "Pages",
            href: "/",
          },
          {
            text: "Setting",
            active: true,
          },
        ],
        value: ["javascript"],
        date: null,
        assetUrl: process.env.VUE_APP_ENVIRONMENT != 'local' ? process.env.VUE_APP_API_URL : process.env.VUE_APP_LOCAL_URL,
        isSubmited:false,
        loader:false,
        disabled:false,
        user:{
          name:"",
          email:"",
          phone:"",
          language:"english",
          visible_password:"",
          role_id:3,
          business_name:"",
          business_type:"",
          bank_account:"",
          address:"",
          city:"",
          state:"",
          zip:"",
          country:"india",
        }
      };
    },
     computed: {
      ...mapGetters({
        getProfileAttachments: "profile/getProfileAttachments",
      }),
      ...mapState('auth', {
        userData: state => state.user,
      }),
      profileType(){
        if(this.userData.role_id ==1){
          return 'Super Admin'
        }else if(this.userData.role_id ==2){
          return 'Team'
        }else if(this.userData.role_id ==3){
          return 'User'
        }
        return null;
      }
    },
    validations: {
      user:{
        name: {
          required: helpers.withMessage("Name is required", required),
        },
        email: {
          required: helpers.withMessage("Email is required", required),
          email: helpers.withMessage("Please enter valid email", email),
        },
        phone: {
          required: helpers.withMessage("Phone is required", required),
          numeric: helpers.withMessage("Please enter only numbers", numeric),
        },
        language: {
          required: helpers.withMessage("Language is required", required),
        },
        visible_password: {
          required: helpers.withMessage("Password is required", required),
        },
        role_id: {
          required: helpers.withMessage("Role is required", required),
        },
        // business_name: {
        //   required: helpers.withMessage("Business Name is required", required),
        // },
        country: {
          required: helpers.withMessage("Country is required", required),
        },
    }
  },
    created(){
      this.setProfileAttachments()
      this.setUsersData()
    },
    methods: {
      ...mapActions({
        setProfileAttachments: "profile/setProfileAttachments",
        updateUserDb:'users/updateUser',
        setUserData:'auth/setUserData',
      }),
      getDate(date) {
        return moment(date).format("MM/DD/YY");
      },
      setUsersData(){
        console.log('userData',this.userData)
         this.user = {
          id: this.userData.id,
          name: this.userData.name,
          email: this.userData.email,
          phone: this.userData.phone,
          language: this.userData.language,
          visible_password: this.userData.visible_password,
          role_id: this.userData.role_id,
          business_name: this.userData.user_businesses && this.userData.user_businesses.business_name ? this.userData.user_businesses.business_name : null,
          business_type: this.userData.user_businesses && this.userData.user_businesses.business_type ? this.userData.user_businesses.business_type : null,
          bank_account: this.userData.user_businesses && this.userData.user_businesses.bank_account ? this.userData.user_businesses.bank_account : null,
          address: this.userData.user_businesses && this.userData.user_businesses.address ? this.userData.user_businesses.address : null,
          city: this.userData.user_businesses && this.userData.user_businesses.city ? this.userData.user_businesses.city : null,
          state: this.userData.user_businesses && this.userData.user_businesses.state ? this.userData.user_businesses.state : null,
          zip: this.userData.user_businesses && this.userData.user_businesses.zip ? this.userData.user_businesses.zip : null,
          country: this.userData.user_businesses && this.userData.user_businesses.country ? this.userData.user_businesses.country : null,
        }
      },
      updateUser(){
        this.isSubmited = true;
        this.v$.user.$touch();
        if (this.v$.user.$invalid) {
          return;
        } 
        this.loader=true
        this.disabled=true
        this.updateUserDb(this.user).then((res)=>{
          this.loader=false
          this.disabled=false
          if(res.data.status){
            var userDb = res.data.data
            console.log('users',userDb)
            this.setUserData(userDb)
            this.$toast.open({
              message: "User updated.",
              type: "success",
            })
          }else{
            // let message=res.data.message
            // this.$toast.open({
            //     message: message,
            //     type: "error",
            //   })
          }
        }).catch((error)=>{
          this.loader=false
          this.disabled=false
          if(error.response && error.response.status == 422 && error.response.data && error.response.data.data.email){
            this.$toast.open({
                message: 'The email has already been taken.',
                type: "error",
              }) 
          }else if(error.response && error.response.status == 422 && error.response.data && error.response.data.data.phone){
            this.$toast.open({
                message: 'The phone has already been taken.',
                type: "error",
              }) 
          }else{
              this.$toast.open({
                message: 'Server Error',
                type: "error",
              })  
          }
        })
      },
      nameInitials(name){
          var nameArray = name.split(" ");
          var initials = '';
          if(nameArray.length === 1) {
              return nameArray[0].charAt(0) + "" +nameArray[0].charAt(1);
          }else{
              initials = nameArray[0].charAt(0);
          }
          for (var i = (nameArray.length - 1); i < nameArray.length; i++){
              initials += nameArray[i].charAt(0);
          }
          return initials.toUpperCase();
      },
    },
    components: {
      Layout,Multiselect
    },
  };
</script>

<template>
  <Layout>
    <div class="position-relative mx-n4 mt-n4">
      <div class="profile-wid-bg profile-setting-img">
        <img src="@/assets/images/profile-bg.jpg" class="profile-wid-img" alt="" />
        <div class="overlay-content">
          <div class="text-end p-3">
            <div class="p-0 ms-auto rounded-circle profile-photo-edit">
              <input id="profile-foreground-img-file-input" type="file" class="profile-foreground-img-file-input" />
              <label for="profile-foreground-img-file-input" class="profile-photo-edit btn btn-light">
                <i class="ri-image-edit-line align-bottom me-1"></i> Change
                Cover
              </label>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="row">
      <div class="col-xxl-3">
        <div class="card mt-n5">
          <div class="card-body p-4">
            <div class="text-center">
              <div class="
                  profile-user
                  position-relative
                  d-inline-block
                  mx-auto
                  mb-4
                ">
                <div class="avatar-xl mt-3">
                    <div class="avatar-title rounded-circle bg-soft-danger text-danger fs-22">
                        {{nameInitials(userData.name)}}
                    </div>
                </div>
              </div>
              <h5 class="fs-16 mb-1">{{userData.name}}</h5>
              <p class="text-muted mb-0">{{profileType}}</p>
            </div>
          </div>
        </div>
      </div>
      <!--end col-->
      <div class="col-xxl-9">
        <div class="card mt-xxl-n5">
          <div class="card-header">
            <ul class="
                nav nav-tabs-custom
                rounded
                card-header-tabs
                border-bottom-0
              " role="tablist">
              <li class="nav-item">
                <a class="nav-link active text-body" data-bs-toggle="tab" href="#personalDetails" role="tab">
                  <i class="fas fa-home"></i>
                  Personal Details
                </a>
              </li>
              <!-- <li class="nav-item">
                <a class="nav-link text-body" data-bs-toggle="tab" href="#changePassword" role="tab">
                  <i class="far fa-user"></i>
                  Change Password
                </a>
              </li> -->
              <li class="nav-item">
                <a class="nav-link text-body" data-bs-toggle="tab" href="#download" role="tab">
                  <i class="far fa-envelope"></i>
                  Download
                </a>
              </li>
            </ul>
          </div>
          <div class="card-body p-4">
            <div class="tab-content">
              <div class="tab-pane active" id="personalDetails" role="tabpanel">
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
                            v-model="user.name"
                            :class="{
                              'is-invalid': isSubmited && v$.user.name.$error,
                            }"
                          />
                            <div
                                v-for="(item, index) in v$.user.name.$errors"
                                :key="index"
                                class="invalid-feedback"
                              >
                                <span v-if="item.$message">{{ item.$message }}</span>
                            </div>
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
                            v-model="user.email"
                            :class="{
                              'is-invalid': isSubmited && v$.user.email.$error,
                            }"
                          />
                            <div
                                v-for="(item, index) in v$.user.email.$errors"
                                :key="index"
                                class="invalid-feedback"
                              >
                                <span v-if="item.$message">{{ item.$message }}</span>
                            </div>
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
                            v-model="user.phone"
                            :class="{
                              'is-invalid': isSubmited && v$.user.phone.$error,
                            }"
                          />
                            <div
                                v-for="(item, index) in v$.user.phone.$errors"
                                :key="index"
                                class="invalid-feedback"
                              >
                                <span v-if="item.$message">{{ item.$message }}</span>
                            </div>
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
                                v-model="user.language"
                                :class="{
                                  'is-invalid': isSubmited && v$.user.language.$error,
                                }"
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
                                v-model="user.language"
                                :class="{
                                  'is-invalid': isSubmited && v$.user.language.$error,
                                }"
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
                            type="text"
                            class="form-control"
                            id="password"
                            placeholder="Enter your Password"
                            v-model="user.visible_password"
                            :class="{
                                'is-invalid': isSubmited && v$.user.visible_password.$error,
                              }"
                            />
                            <div
                                v-for="(item, index) in v$.user.visible_password.$errors"
                                :key="index"
                                class="invalid-feedback"
                              >
                                <span v-if="item.$message">{{ item.$message }}</span>
                            </div>
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
                            v-model="user.business_name"
                          />
                        </div>
                      </div>
                      <div class="row mb-4">
                          <div class="col-lg-3">
                            <label for="phone" class="form-label">Business Type</label>
                          </div>
                          <div class="col-lg-9">
                            <div class="mt-4 mt-lg-0">
                              <div class="form-check form-check-inline">
                                <input
                                  class="form-check-input"
                                  type="radio"
                                  name="business_type"
                                  id="private-limited"
                                  value="private-limited"
                                  v-model="user.business_type"
                                />
                                <label class="form-check-label" for="private-limited"
                                  >Private Limited</label
                                >
                              </div>
                              <div class="form-check form-check-inline">
                                <input
                                  class="form-check-input"
                                  type="radio"
                                  name="business_type"
                                  id="public-limited"
                                  value="public-limited"
                                  v-model="user.business_type"
                                />
                                <label class="form-check-label" for="public-limited"
                                  >Public Limited</label
                                >
                              </div>
                              <div class="form-check form-check-inline">
                                <input
                                  class="form-check-input"
                                  type="radio"
                                  name="business_type"
                                  id="propertiership"
                                  value="propertiership"
                                  v-model="user.business_type"
                                />
                                <label class="form-check-label" for="propertiership"
                                  >Propertiership</label
                                >
                              </div>
                            </div>
                          </div>
                      </div>
                      <div class="row mb-4">
                        <div class="col-lg-3">
                          <label for="bank_account" class="form-label">Bank Account</label>
                        </div>
                        <div class="col-lg-9">
                          <textarea class="form-control" id="bank_account" rows="3" placeholder="Enter your Bank Account" v-model="user.bank_account"></textarea>
                        </div>
                      </div>
                    </div>

                    <div class="col-6">
                    
                      <div class="row mb-4">
                        <div class="col-lg-3">
                          <label for="address" class="form-label">Address</label>
                        </div>
                        <div class="col-lg-9">
                          <textarea class="form-control" id="address" rows="3" placeholder="Enter your address" v-model="user.address"></textarea>
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
                            v-model="user.city"
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
                            v-model="user.state"
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
                            v-model="user.zip"
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
                          <Multiselect
                            v-model="user.country"
                            :class="{
                            'is-invalid': isSubmited && v$.user.country.$error,
                            }"
                            :close-on-select="true"
                            :create-option="true"
                            :clearable="false"
                            :searchable="true"
                            :options="[
                              { value: 'india', label: 'India' },
                              { value: 'uae', label: 'UAE' },
                            ]"
                          />
                          <div
                                v-for="(item, index) in v$.user.country.$errors"
                                :key="index"
                                class="invalid-feedback"
                              >
                                <span v-if="item.$message">{{ item.$message }}</span>
                            </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="text-end float-end">
                      <button class="btn btn-primary align-items-center d-flex justify-content-center" :disabled="disabled" @click="updateUser">
                        Update User
                        <div class="spinner-border loader-setup" role="status" v-if="loader">
                            <span class="sr-only">Loading...</span>
                          </div>
                      </button>
                  </div>
                </div>
              </div>
              <!--end tab-pane-->
              <div class="tab-pane" id="changePassword" role="tabpanel">
                <form action="javascript:void(0);">
                  <div class="row g-2">
                    <div class="col-lg-4">
                      <div>
                        <label for="oldpasswordInput" class="form-label">Old Password*</label>
                        <input type="password" class="form-control" id="oldpasswordInput"
                          placeholder="Enter current password" />
                      </div>
                    </div>
                    <!--end col-->
                    <div class="col-lg-4">
                      <div>
                        <label for="newpasswordInput" class="form-label">New Password*</label>
                        <input type="password" class="form-control" id="newpasswordInput"
                          placeholder="Enter new password" />
                      </div>
                    </div>
                    <!--end col-->
                    <div class="col-lg-4">
                      <div>
                        <label for="confirmpasswordInput" class="form-label">Confirm Password*</label>
                        <input type="password" class="form-control" id="confirmpasswordInput"
                          placeholder="Confirm password" />
                      </div>
                    </div>
                    <!--end col-->
                    <!-- <div class="col-lg-12">
                      <div class="mb-3">
                        <a href="javascript:void(0);" class="link-primary text-decoration-underline">Forgot Password
                          ?</a>
                      </div>
                    </div> -->
                    <!--end col-->
                    <div class="col-lg-12">
                      <div class="text-end">
                        <button type="submit" class="btn btn-success">
                          Change Password
                        </button>
                      </div>
                    </div>
                    <!--end col-->
                  </div>
                  <!--end row-->
                </form>
              </div>
              <!--end tab-pane-->
              <div class="tab-pane" id="download" role="tabpanel">
                  <div class="history" v-if="getProfileAttachments.length > 0">
                    <!-- <h3 class="mb-2">Attachment History</h3> -->
                    <div class="card-body px-0">
                      <div class="table-responsive table-bordered">
                        <table class="table align-middle table-nowrap mb-0">
                          <thead>
                            <tr>
                              <th scope="col">Date</th>
                              <th scope="col">Comment</th>
                              <th scope="col">Attachment</th>
                              <th scope="col">Send Email</th>
                              <th scope="col">Personal Note</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr
                              v-for="(attachment, index) in getProfileAttachments"
                              :key="index"
                            >
                              <td>{{ getDate(attachment.created_at) }}</td>
                              <td>{{ attachment.notes }}</td>
                              <td>
                                <a v-if="attachment.attachment" :href="`${assetUrl}/storage/${attachment.attachment}`" download="" target="_blank">Download</a>
                                <span v-else>--</span>
                              </td>
                              <td>{{attachment.is_send_email ? 'Yes' : 'No'}}</td>
                              <td>{{attachment.is_personal_note ? 'Yes' : 'No'}}</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
              </div>
              <!--end tab-pane-->
            </div>
          </div>
        </div>
      </div>
      <!--end col-->
    </div>
    <!--end row-->
  </Layout>
</template>