<script>
import Layout from "../../layouts/main.vue";
import PageHeader from "@/components/page-header";

import "prismjs";
import "prismjs/themes/prism.css";
import { mapActions, mapGetters } from "vuex";

export default {
    data() {
        return {
            title: "Services",
            services : [],
            assetUrl: process.env.VUE_APP_ENVIRONMENT == 'local' ? process.env.VUE_APP_LOCAL_URL : process.env.VUE_APP_API_URL,
        };
    },
    components: {
        Layout,
        PageHeader,
    },
    computed: {
        ...mapGetters({
            userData: "auth/user",
            getServices: "service/getServices",
        }),
    },
    async mounted() {
       this.getServicesByUserData()
    },
    methods: {
        ...mapActions({
            getServicesByUser: "service/getServicesByUser",
        }),
        getServicesByUserData() {
            this.getServicesByUser(this.userData.id)
            .then((res) => {
                if (res.data.status) {
                    this.services = res.data.data.services
                } else {
                    this.services = [];
                }
            })
            .catch((e) => {
                console.log(e);
            });
        },
        getPrice(prices) {
            var priceData = JSON.parse(prices)
            return priceData
            // return `One Time: ${priceData.onetime}, Monthly: ${priceData.onetime}, Quaterly: ${priceData.quaterly}, Yearly: ${priceData.yearly}`;
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
        getImage(image){
            if(image){
                return this.assetUrl + '/storage/' +image
            }
            return null
        },
        buyService(service){
          this.$router.push({
            name: 'ServiceOrder',
            params: {
              id: btoa(service.id)
            },
          });
        }
    },
};
</script>

<template>
  <Layout>
    <PageHeader :title="title" />
    <div class="row">
      <div class="col-xxl-3 col-md-4 col-sm-6 col-xs-12 mb-3" v-for="(service,index) in services" :key="index">
        <div class="card h-100">
            <img class="service-image" v-if="service.service_image"  :src="getImage(service.service_image)" alt="Card image cap">
            <div class="avatar-title rounded bg-soft-primary text-primary" v-else>{{nameInitials(service.title)}}</div>
            <div class="card-body">
                <h4 class="card-title mb-2">{{service.title}}</h4>
                <p class="card-text" v-html="service.description"></p>
            </div>
            <div class="card-body border-top border-top-dashed pb-3">
                <h6>Pricing:</h6>
                <div class="d-flex flex-wrap gap-2">
                    <span class="btn rounded-pill btn-soft-primary btn-sm" v-if="getPrice(service.prices) && getPrice(service.prices)['onetime']">One Time: {{getPrice(service.prices)['onetime']}}</span>
                    <span class="btn rounded-pill btn-soft-primary btn-sm" v-if="getPrice(service.prices) && getPrice(service.prices)['monthly']">monthly: {{getPrice(service.prices)['monthly']}}</span>
                    <span class="btn rounded-pill btn-soft-primary btn-sm" v-if="getPrice(service.prices) && getPrice(service.prices)['quaterly']">Quaterly: {{getPrice(service.prices)['quaterly']}}</span>
                    <span class="btn rounded-pill btn-soft-primary btn-sm" v-if="getPrice(service.prices) && getPrice(service.prices)['yearly']">Yearly: {{getPrice(service.prices)['yearly']}}</span>
                </div>
                <!-- <p>{{ getPrice(service.prices)}}</p> -->
          </div>
          <div class="card-footer text-end">
                <a @click="buyService(service)" class="card-link link-secondary cursor-pointer">View Details <i class="ri-arrow-right-s-line ms-1 align-middle lh-1"></i></a>
            </div>
        </div>
        <!-- <div class="card mb-2">
          <div class="card-body pb-0">
            <div class="d-flex mb-3 align-items-center">
              <div class="flex-shrink-0 avatar-lg">
                <div class="avatar-title bg-light rounded" v-if="service.service_image">
                  <img
                  :src="getImage(service.service_image)"
                    alt="Service Image"
                    class="service-image"
                  />
                </div>
                <div class="avatar-title rounded bg-soft-primary text-primary fs-14" v-else>{{nameInitials(service.title)}}</div>
              </div>
              <div class="flex-grow-1 ms-3">
                <h5 class="fs-14 mb-1">{{service.title}}</h5>
              </div>
              <div>
                <button class="btn btn-soft-primary btn-sm" @click="buyService(service)"
                  >
                  <i class="ri-shopping-cart-line"></i> Buy Now</button>
              </div>
            </div>
            <div v-html="service.description"></div>
          </div>
          <div class="card-body border-top border-top-dashed pb-0">
                <h6>Pricing:</h6>
                <p>{{ getPrice(service.prices)}}</p>
          </div>
        </div> -->
        <!--end card-->
      </div>
      <!--end col-->
    </div>
  </Layout>
</template>

<style scoped>
.service-image{
    width: 100%;
    height: 100%;
    max-height: 200px;
    object-fit: cover;
    border-radius: 7px;
}
.avatar-title{
  font-size: 60px;
  max-height: 200px;
}
</style>
