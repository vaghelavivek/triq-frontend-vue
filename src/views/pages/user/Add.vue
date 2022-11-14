<script>
import Layout from "../../../layouts/main.vue";
import PageHeader from "@/components/page-header";
import Multiselect from "@vueform/multiselect";
import "@vueform/multiselect/themes/default.css";
import {mapActions} from 'vuex'
import "prismjs";
import "prismjs/themes/prism.css";
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
  data() {
    return {
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
  components: {
    Layout,
    PageHeader,
    Multiselect
  },
  methods:{
    ...mapActions({
      addUserDb:'users/addUser',
      getUserById:'users/getUserById',
      updateUserDb:'users/updateUser',
    }),
    addUser(){
         this.isSubmited = true;
          this.v$.user.$touch();
          if (this.v$.user.$invalid) {
            return;
          } 
          this.loader=true
          this.disabled=true
          this.addUserDb(this.user).then((res)=>{
            this.loader=false
            this.disabled=false
            if(res.data.status){
                this.$toast.open({
                  message: "User added.",
                  type: "success",
                })
            }else{
              let message=res.data.message
              this.$toast.open({
                  message: message,
                  type: "error",
                })
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
        
    }
  },
  mounted() {
    if(this.$route.name == 'EditUser' && this.$route.params.id){
        this.getUserById(this.$route.params.id).then((res)=>{
          if(res.data.status){
            this.user=res.data.data.user
          }else{
            this.$router.push({name:"Users"})
          }
        }).catch(()=>{
            this.$router.push({name:"Users"})
        });
    }
  },
};
</script>

<template>
  <Layout>
    <PageHeader :title="user.id ? 'Update User' : 'Add User'" />
    <div class="row">
      <div class="col-xl-12">
        <div class="card">
          <div class="card-header align-items-center d-flex">
            <h4 class="card-title mb-0 flex-grow-1">{{user.id ? 'Update' : 'Add'}} Users</h4>
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
                    <label for="phone" class="form-label">Role</label>
                  </div>
                  <div class="col-lg-9">
                    <div class="mt-4 mt-lg-0">
                      <div class="form-check form-check-inline">
                        <input
                          class="form-check-input"
                          type="radio"
                          name="role-radio"
                          id="super-admin"
                          value="1"
                          v-model="user.role_id"
                          :class="{
                          'is-invalid': isSubmited && v$.user.role_id.$error,
                          }"
                        />
                        <label class="form-check-label" for="super-admin"
                          >Super Admin</label
                        >
                      </div>
                      <div class="form-check form-check-inline">
                        <input
                          class="form-check-input"
                          type="radio"
                          name="role-radio"
                          id="team"
                          value="2"
                          v-model="user.role_id"
                          :class="{
                          'is-invalid': isSubmited && v$.user.role_id.$error,
                          }"
                        />
                        <label class="form-check-label" for="team"
                          >Team</label
                        >
                      </div>
                      <div class="form-check form-check-inline">
                        <input
                          class="form-check-input"
                          type="radio"
                          name="role-radio"
                          id="user"
                          value="3"
                          v-model="user.role_id"
                          :class="{
                          'is-invalid': isSubmited && v$.user.role_id.$error,
                          }"
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
                <button class="btn btn-primary align-items-center d-flex justify-content-center" v-if="!user.id" :disabled="disabled" @click="addUser">
                    Add User
                    <div class="spinner-border loader-setup" role="status" v-if="loader">
                        <span class="sr-only">Loading...</span>
                      </div>
                  </button>
                  <button class="btn btn-primary align-items-center d-flex justify-content-center" v-else :disabled="disabled" @click="updateUser">
                    Update User
                    <div class="spinner-border loader-setup" role="status" v-if="loader">
                        <span class="sr-only">Loading...</span>
                      </div>
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
<style>
.multiselect.is-invalid {
    border: 1px solid red !important;
}
</style>