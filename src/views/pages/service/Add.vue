<script>
import Layout from "../../../layouts/main.vue";
import PageHeader from "@/components/page-header";
import Multiselect from "@vueform/multiselect";
import "@vueform/multiselect/themes/default.css";

import "prismjs";
import "prismjs/themes/prism.css";
import { required, helpers } from "@vuelidate/validators";
import useVuelidate from "@vuelidate/core";
import { mapActions } from "vuex";

export default {
  setup() {
    return { v$: useVuelidate() };
  },
  data() {
    return {
      title: "Add",
      service: {
        id: null,
        title: null,
        description: null,
        country: "india",
        image: null,
        price: null,
        tenure: "monthly",
        document_names: [],
      },
      serviceImageData:null,
      isSubmited: false,
      imageData: null,
      imageUrl: null,
      assetUrl: "http://127.0.0.1:8000",
      loader:false,
      disabled:false,
    };
  },
  validations: {
    service: {
      title: {
        required: helpers.withMessage("Title is required", required),
      },
      price: {
        required: helpers.withMessage("Price is required", required),
      },
    },
  },
  components: {
    Layout,
    PageHeader,
    Multiselect,
  },
  computed: {
    dbserviceImageSrc() {
      if (this.service.image && this.service.image.search("blob:") == -1) {
        return this.assetUrl + "/storage/" + this.service.image;
      } else if (this.service.image) {
        return this.service.image;
      } else {
        return "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wgARCADsAOwDASIAAhEBAxEB/8QAGwABAAIDAQEAAAAAAAAAAAAAAAUGAwQHAgH/xAAZAQEBAQEBAQAAAAAAAAAAAAAAAQIDBAX/2gAMAwEAAhADEAAAAeoAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHw+tHXSWY8igAAAAAAAAAHzSud7xrQCy0FpTWsxdS6hRzL0nlHV5QzoAAAAAAAB491LXDZk8tGrZr0VK3cvn089m3m1Mxu2KrS01ODnsAAAAAAADFT7RVenzbFyzs9Dz9Dns7j3rNnNIydkLISfmXHI1mOOkIuUxoFAAAAAAA+c36TEb8mCd5Xta8fS1DzTtdlLkOPSxeoTY595Oi3LU69KN0zmvStgzoAAAAAAADQ5d2CndvBVNvXy+n4m5JQ+bhbVtRm14/sSGjLV3fu+Wjx71oJQAAAAAAAHn0OdRfVaD6/jRubU2unzp2x4ZHx/d0tzJ9z7AlAAAAAAAAAGIytDGacnrtcpRG5s9dx8+gAAAAAAAAp6XBW9Wrc55ayY+8pl0v/yheVv6r4S3KTEnTELTzpTz6lAAAAAAVqykrXuxKotq+Rx6xbeM0pvX0TUxTHyzBoblpl+1izIBQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP//EACsQAAICAgEDBAAFBQAAAAAAAAEDAgQABRIRE0AGFCEiEBUgI3AwMTI0UP/aAAgBAQABBQL+JSQBK0qOe/R1XOLI+RKQgGWTjHc5TRbkLNpiW6C7zueKSIhbC/GuEMfYEcDO4VXAsRvQOeourrHptfPZeJOQhFfLYNsv7eWbQgIzLmDBgwHEHtTQ3ujw9k0vf9atWxYOMb3J1P8AAYMGDAcon93wmy4L1g5XNmD7G3P6wyrL6jBi5dMhZ6ZG1E4iSDLwrvzU18xGx/fNhpZmR1d2JTrLpxOrsHI6sYNavJa4ZZRarhF5LDTfy8IjqGA1X07sZRB6/p5D8d7roHNU+a3eFsKYswlGS5reyGRv2M9+/BbaSOksjGOCEcVI9dl/pVl8rXh3K0bKjOUJBpyBOA5WZ8xOROI+Z7Wf7OqR9/E3VT5GA4DkTkJdR1OQiFrlGVuxCIhHxCARsaZqsBwHAcXLpCsngG9XFcAuPjMhFkL9CVYg4qJZOpV7WEcsA6eU7VonKvXXXj5MzMYZNzmzObM5swTbgk3/AKW4sPlbpa91Wxu7Lotu1rOrXZbz1NLa2KqfT7Xyu7uc/wAz1r2q22+syUjRvZz9SOao3NlKwrbIY6qu3a2c4jjH+ttaE7DKcdmbG215uBtHZXcsI5UdbR7NOhSajZbHXSt7GtTr1ctaxt3Yw1Lat7cUm257LTltzNVSbVs+Fe7/AGbXu4N5Wfe682+6e/CxGV72a22Y403OMpXuH8f/AP/EACcRAAEDAwMBCQAAAAAAAAAAAAEAAhEDBDASITEiEBMVICMyUFFg/9oACAEDAQE/AfhpyFwGylStkMVet3TZVNhYOrk+QYrs+tTnhHshQcd3QNRst5Cp35Z0vC8SpfRTbxr/AGhCpK5CbivaIc3WAnKm/QUx6GwhDHdWmjqZwtMq2oFo1OzNosadQGaVKlSp/A//xAAiEQACAgEDBAMAAAAAAAAAAAAAAQIRMAMhMRITIFAEEFH/2gAIAQIBAT8B9NWShIo3JYox6mc+EliTqJF/VotGzxQa4lwP48lwztNEnR3H+EJdW5LFpS3oonpkomnGkN3j09Xq2Y0SpvM5t7ZKKKKKKKw343Xs/wD/xAA3EAABAwEFBAgFAgcAAAAAAAABAAIDEQQSITFBEyIyQBAUI1FSYXGBIDORobFCcDA0UGNyktH/2gAIAQEABj8C/aWpwXFX0CxLh7K8whw8uZq40W7u+qo2sjvqqiE/UIxywytcNCtmCaPGR5apNAqs3YvFq70V1uLvwquNXKr8W9yo2FoHksWkKN8bHFgZS9RB3gaTypc40AV52FmYeHxK4zi/CwWOXwlzAATnhmu48oLPHlXH1WGTAjjiV5Kvxe3Jud3CqDnZ4lSU0xTuinTwg+q+XF/qt+Fvsqx7ru7k5qeFMdocFii6yEU8Dl/LP9l8kt9SF2hjb7relPsFxvW5IR6hXtkJmf2zj9FSt13c5XH56clQ5J0bsgg1591h8OY6esMF0nBybFJpwnk6jCRuRRa8Frgt17gvmfZcf2W9I6nkscfUrhCyp6ItdiRqpVEB4uUIIF+m67uRa9u8MCsGrGnRd6Xu9kGeIoynTAcr1hg/z/78IKAbxHJU0Gqw4fwEGtyHKkHEFVbjEcj3eXwNV5/GfsrjODUqjeXLXirTorzN6Lv7ugNaCSdAr8mMn4WOSw5q828zyCpGPfXmt0VWX2Wv0WZWq1+i4f6lBYrM/ZmTNyDuuSSR0xa7VQWWzOuPl/Um2iK1vkxo4OUkzKtJivDywTtpekDx2Zd3q0NtD3khuTjkaqzxC0OhY5uJDqUxXVhaTaYSM80yGEkTTOoKZqeyWlxdLEcydFZti97SSeE55Kxlj3RyB1JGtNO5Hq73slbiLppXyVns8bnR3R2r24IAafx457M8MnjyrqmutT4hEM2jVRvhfcnjyKbHbJI2xA43dVJBFhuXGqKO0tY58bi4a0VrnfduSZUPmoJCGmBoo8EomCINJ1TpJ33IQKMunFQzWWS+0ce0OKsxiu9mampTZ7NdFTV4PRanyXaSHCh8+TrZj2gOVK1QbEZHUa26QBQnW8rlHbPaVvaXLuX1UnWr139NfVWh9ZHxhlWMwxKIka/ah4q5tKlvkrKZI5CC03wBXHRHZ8W3wrlcVj+ZiO1oBn+4H//EACsQAQACAQIFAgYDAQEAAAAAAAEAESExQUBRYXGBEJGhscHR4fEgcPAwUP/aAAgBAQABPyH+pbEg5rU+vUwxOoMiVndcTXAJmVpz1RaTpcp4ctD8WaqpqJrsC+cFjwzkwZV2mpewv0DrNJA9u6Ov+N8I9dyb1cI9dtT4R2Zm2UG62Lsrj3x9eFHkK1Y1i4zmdYQsCmXl+8Zirm/7eamb2OKL0h1vv8yCmKdThHuwB1fhKdT51/cyDulj3XjpBS3LFFHF6WQdfB2/vRq4B5f8xnRl2HMRA5RTO3mYooOvy0TTJhlxtMKtjgyi1Xjodx5iAQCOEYqW9yq7Modng/WICdcT6wL4oWG1UQ/glTKd6JKZq4XlDd/aPjEzLOrnwQMFopg32mOpszPjMH3wBaE5n8afvQR0R9NaQw6LsxgFtafLgydOqt+jNfqAz4djA83cQXZ7YW+EIalN90Z+CzYWc8IhTUHMQjdyPmRjma8JmuDBlSiwtHJjNVe8TtdD0KLNHT1Dogo+NZQfWx7ExPj3O/Cjz3A+UOvUKUTadZCDOXjH1gK2HK+cRtjmgNFFQcKTICkd5RJX94/gBvZaADVYzaXno5TZgeWVyx8+HAaSlRJd7rv+/qUtgCIdDTpPvFww5ecAUKOJSynSWst10fxMea6rK88VpH5To8Mz9ROt7JyCjeDziF1nX/0WIZR65/THDYqWr3ZfcORhq6C9pRXjZ030vSKwR1ObWgSXSq60+TpM3/zXsNpXl+8GTLmAHrVuDVwJ4LtAv9EOsKlpd3+6ze/ZC2jvHzFc5fRrN/Ud6sZ2nIU1i/xzYNioUW2/9+3sMGsMuiBuSiIttHfxMjZtzwN5UgswXBiiCklZqLqRALbrHdmHEwxFLY4FlOp92GO1A8fGN2bSYKUbmnKK3VcNuae0TGvTrN6nebzVP/OdTn34OrHi2AcN9rvxKSgGQvx45R8J0d45yjWJdBz8jGKxnnMMNUqLdhi9j3ghisCTryWadoABCQixZ02uYZu2hLU36dZaEKuoZGuOV/2B/9oADAMBAAIAAwAAABDzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzzj/zzzxzzzzzzzDJabXzzzzzzzzzkdMt+jzzzzzzzzyS6o9obfzyzzzzzxpt3ujVbzzzzzzzzwoUWmbXzzzzzzzzzy+Jj3zzzzzzzzzziDHzzzzzzzzzzvnS9LzbzTzzzzzz937a52Z/zzzzDTzzzzzzzzzzDzjzzzzzzzzzzzzzzzzzzzzzzzzzzzzzz/8QAJREBAAIBAwIHAQEAAAAAAAAAAQARMSEwQVFxUGGRocHR4RCx/9oACAEDAQE/EPBqbiByeI0mrMSlkx2i09roHVlhV5n47HEf60a2tCwN+8LkiXLyiWmYNl7JLyDz6kG1devvDm9A+586afcfh7/kssNtnEM9vyA4IosNLgRWYKK2sx0l2dPyKVGYay8HTv5/5A53aKx21qXpbBgWZVMqjTSNNhLlaVKqaTQlEoZXiX//xAAiEQEAAgICAQQDAAAAAAAAAAABABEhMTBBURBQYeGRsdH/2gAIAQIBAT8Q9mtyCcxWYaINqZtxYiLfGjUPHqCXxXT5xAMMGvSWlaGJTTw5u5Owj5/pv8RFmJ1iP2+oQBOvE5a7i+2XZJRNlLF8ZDv/AHKtx4EXo5QrOOMLZk0R8IsmtzS4NzCxfANZm1y1luZlKuW6loGse5f/xAArEAEAAQMDAwMFAQADAQAAAAABEQAhMUFRYRCBkUBxsSAwocHw0VDh8XD/2gAIAQEAAT8Q/wCcv9i/W/S/S/0Xq9Xq/S/0X/4e1W6W+i30x1t6dwE5EPLU3KZ/6OKsxtzH4msGUph7e/H3+/2tKsk5XYMr7VHAbML9jB3mtsCAf+jtTeDyNDwVA0eAGHCQojuMVEgR8hPeDCTz6YpXycA3Wl4NKo9g+Vd0DNBogXF8jfjPtTlFMrcONB/Xoy+ayz70vFHQeiS97X70gHNoP6pkAamJNDqQfNEgnbYiJ+Xj7kdI+tr7scBV2XCtHjmGU0xu0AgJAW0IN2hoX2oRqMjML8qrzAME3TnmhACwWArH0+ShRaAAQY5Za0KG5JG56Se9HWH0ePlO1QYsY+blX5qFPov3ctJpJrd+XloNiXY+j2PWg3KR0z8h6MMW8YTT35KusM+aMgVBjYv4X7U1t4FttawUClhIG49fXlf3g7CVCEf+b1FAtyH4T90TMVXUh2MONPR6tlOxP6olga20I+YoyhIEiORK3KKVxwpwx7tPldaz8lFoxsWgSM1TwQR+aJJjUI+Wgrq9v6qS2hCfwlA8jKkW6UvZaLT7AM14wnvVzgJXINHn0U1gg3EhpPndTg9yKEqhIzGxyPNF3vCSVbjq2JbHNKIReTRMkcM9IscOG4ym7h7NQf0clgbz1ImO5Tl9E6JzoD8Wzo96ZEcDhOfbkpMff2hQn7/+qGuPt/jUhV5EM8FGQmkkPlo8R4tTRLTVZ4qOKRBCm/IkUKRynvaqURNHYm/4mtfRmfAG4O+05KDKzJhBhKbj+A2q7AdxXu9JDX4LtWO/QmFrLdk/kxRMLQO58xStizOZWXYt3fu9uvau1dunaiQSQAYcfAPZoRAAbHUkYQqSjI0GhCmbCdVwZatfodZqr3ZaMwUEjB+29t3pP6Hau1dvq7fcdKQaQNka5UpEvk2dTn6KoiiQKUYA3qLliQZNq/Lq0nLIvYWxvQ+Nkrlbvp4W3lsn9rR/vZMuDj/6joLWSAJX/DmmQIgyJ8rv+lXtdct/c6HBQEg4AgPUggCiESRKTy1LRfsJ+FqenzP3P6FvVKENF1u8UbK9k61Cf5xX8L/KNF/7xSMe4/609JRw/wBU0UhC4Mx9Xjr4rx9pEyR0hMkdMaVfmruBavzV67V2qFwVC4KjYrt98xgjqASAJcARi7YpgMkx2W4BrJDzFMLi3QIk0JlUvaCiITWT4XIUkI3JkaeIsMJAhLyTmn7q7iM7t5M5SG9Bk860C5haWxioMcZApSAaGWn8qFBOQywiQwwzvTwLFAxKJcVZOWkJ1YaYgt0GE4NIdtCAGBDc4d6mR5UJQYG6wnFzSm9LRjGpDeTGyG7TKO50Emly0RqbamOZWZAIut15fs+ennp56WfZJwBheGEVyIijQ0brKRZILIhdd7XpJipcCSCl0II31pEPjRWLTBeCxKBMxTM1GFqR2xerTXkjiIheH+ilrVSl2KEWtzQdgiOZADk1Kj0+SqbSLHFHFPbghEjCSp2KfglJALAlwrXCFFSTxuFcBnKpoAKmIWMbjJvfVqc+ZpM1eYBhIIsOnmvNea89PNeftgLoUwkiDshhL7Wk2eGp0SSRYlhdi9qsuSOLLqakRPMUUoNJt4SELDeuklkqBrQaZNAsYZbSmdDjiXzBElJOEwm7UEYfUXTsjEZuUFnEYMWgi40jUKVICwXCzL0cEFOWN/TRUVHSKgqKg/8AkX//2Q==";
      }
    },
  },
  mounted() {
    if (this.$route.name == "EditService" && this.$route.params.id) {
      console.log("route", this.$route.name);
      this.getServiceData(this.$route.params.id);
      this.title='Update'
    }
  },
  methods: {
    ...mapActions({
      addService: "service/addService",
      getServiceById: "service/getServiceById",
    }),
    clearService() {
      this.service = {
        id: null,
        title: null,
        description: null,
        country: "india",
        image: null,
        price: null,
        tenure: "monthly",
        document_names: [],
      };
    },
    saveService() {
      this.isSubmited = true;
      this.v$.$touch();
      if (this.v$.$invalid) {
        return;
      }
      this.loader=true
      this.disabled=true
      var formdata = new FormData();
      formdata.append("id", this.service.id);
      formdata.append("title", this.service.title);
      formdata.append("description", this.service.description);
      formdata.append("country", this.service.country);
      formdata.append("price", this.service.price);
      formdata.append("tenure", this.service.tenure);
      formdata.append(
        "document_names",
        JSON.stringify(this.service.document_names)
      );
      if (this.imageData) {
        formdata.append("service_image", this.imageData);
      }
      this.addService(formdata)
        .then((res) => {
          this.loader=false
          this.disabled=false
          if (res.data.status) {
            this.isSubmited = false;
            var msg = this.service.id ? 'Service Updated Successfully' : 'Service Added Successfully'
            this.clearService();
            this.$toast.open({
              message: msg,
              type: "success",
            });
            this.$router.push({ name: "Services" });
          }
        })
        .catch((error) => {
          console.log(error)
          this.loader=false
          this.disabled=false
          this.$toast.open({
            message: 'Server Error',
            type: "error",
          });
        });
    },
    onFileChange(e) {
      const file = e.target.files[0];
      if (file) {
        if (
          file.type == "image/png" ||
          file.type == "image/jpg" ||
          file.type == "image/jpeg" ||
          file.type == "image/svg" ||
          file.type == "image/svg+xml"
        ) {
          this.imageData = file;
          this.imageUrl = URL.createObjectURL(file);
          this.service.image = this.imageUrl;
          // var formdata = new FormData();
          // formdata.append('setting_id', this.snippetSetting.id)
          // formdata.append('profile_image', this.imageData)
          // this.updateSnippetserviceImage(formdata)
        } else {
          this.$refs.serviceImage.value = "";
          this.$swal.fire("Error!", "Please enter valid image file.", "error");
        }
      }
    },
    addDocument() {
      var doc = {
        id: null,
        name: null,
      };
      this.service.document_names.push(doc);
    },
    removeDocument(index) {
      this.service.document_names.splice(index, 1);
    },
    getServiceData(serviceId) {
      this.getServiceById(serviceId)
        .then((res) => {
          console.log("resss", res.data);
          if (res.data.status) {
            let service = res.data.data.service;
            let serviceDocument = service.service_document;
            this.service = {
              id: service.id,
              title: service.title,
              description: service.description,
              country: service.country,
              image: service.service_image,
              price: service.price,
              tenure: service.tenure,
            };
            var nameDocument = [];
            serviceDocument.map((doc) => {
              var docData = {
                id: doc.id,
                name: doc.name,
              };
              nameDocument.push(docData);
            });
            this.service.document_names = nameDocument;
            console.log("nameDocument", nameDocument);
          } else {
            this.$router.push({ name: "AddService" });
          }
        })
        .catch((e) => {
          console.log(e);
        });
    },
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
            <h4 class="card-title mb-0 flex-grow-1">{{title}} Service</h4>
          </div>
          <!-- end card header -->
          <!-- <pre>{{ service }}</pre> -->
          <div class="card-body">
            <div class="row">
              <div class="col-md-6 offset-md-3">
                <div class="row mb-4">
                  <div class="col-lg-3">
                    <label for="title" class="form-label">Title</label>
                  </div>
                  <div class="col-lg-9">
                    <input
                      type="text"
                      class="form-control"
                      id="title"
                      placeholder="Enter Service Title"
                      v-model="service.title"
                      :class="{
                        'is-invalid': isSubmited && v$.service.title.$error,
                      }"
                    />
                    <div
                      v-for="(item, index) in v$.service.title.$errors"
                      :key="index"
                      class="invalid-feedback"
                    >
                      <span v-if="item.$message">{{ item.$message }}</span>
                    </div>
                  </div>
                </div>

                <div class="row mb-4">
                  <div class="col-lg-3">
                    <label for="description" class="form-label"
                      >Description</label
                    >
                  </div>
                  <div class="col-lg-9">
                    <input
                      type="text"
                      class="form-control"
                      id="description"
                      placeholder="Enter Description"
                      v-model="service.description"
                    />
                  </div>
                </div>

                <div class="row mb-4">
                  <div class="col-lg-3">
                    <label for="country" class="form-label">Country</label>
                  </div>
                  <div class="col-lg-9">
                    <Multiselect
                      v-model="service.country"
                      :close-on-select="true"
                      :searchable="true"
                      :create-option="true"
                      :options="[
                        { value: 'india', label: 'India' },
                        { value: 'uae', label: 'UAE' },
                      ]"
                    />
                  </div>
                </div>

                <div class="row mb-4">
                  <div class="col-lg-3">
                    <label for="country" class="form-label">Image</label>
                  </div>
                  <div class="col-lg-9">
                    <div class="image-root-div">
                      <input
                        type="file"
                        class="d-none"
                        ref="serviceImage"
                        @change="onFileChange($event)"
                      />
                      <div
                        class="image-block-edit-icon"
                        @click="$refs.serviceImage.click()"
                      >
                        <i class="bx bxs-pencil" aria-hidden="true"></i>
                      </div>
                      <img
                        class="image-block-inside"
                        v-if="serviceImageData"
                        :src="serviceImageUrl"
                      />
                      <img
                        class="image-block-inside"
                        v-else
                        :src="dbserviceImageSrc"
                      />
                    </div>
                  </div>
                </div>

                <div class="row mb-4">
                  <div class="col-lg-3">
                    <label for="price" class="form-label">Price</label>
                  </div>
                  <div class="col-lg-9">
                    <input
                      type="number"
                      class="form-control"
                      id="price"
                      placeholder="Enter price"
                      v-model="service.price"
                      :class="{
                        'is-invalid': isSubmited && v$.service.price.$error,
                      }"
                    />
                    <div
                      v-for="(item, index) in v$.service.price.$errors"
                      :key="index"
                      class="invalid-feedback"
                    >
                      <span v-if="item.$message">{{ item.$message }}</span>
                    </div>
                  </div>
                </div>

                <div class="row mb-4">
                  <div class="col-lg-3">
                    <label for="phone" class="form-label">Tenure</label>
                  </div>
                  <div class="col-lg-9">
                    <div class="mt-4 mt-lg-0">
                      <div class="form-check form-check-inline">
                        <input
                          class="form-check-input"
                          type="radio"
                          id="monthly"
                          value="monthly"
                          v-model="service.tenure"
                        />
                        <label class="form-check-label" for="monthly"
                          >Monthly</label
                        >
                      </div>
                      <div class="form-check form-check-inline">
                        <input
                          class="form-check-input"
                          type="radio"
                          id="quaterly"
                          value="quaterly"
                          v-model="service.tenure"
                        />
                        <label class="form-check-label" for="quaterly"
                          >Quaterly</label
                        >
                      </div>
                      <div class="form-check form-check-inline">
                        <input
                          class="form-check-input"
                          type="radio"
                          id="yearly"
                          value="yearly"
                          v-model="service.tenure"
                        />
                        <label class="form-check-label" for="yearly"
                          >Yearly</label
                        >
                      </div>
                    </div>
                  </div>
                </div>

                <div class="row mb-4">
                  <div class="col-6">
                    <h3>Documents Required</h3>
                  </div>
                  <div class="col-4">
                    <button
                      type="submit"
                      class="btn btn-primary ml-4"
                      @click="addDocument"
                    >
                      Add More Document
                    </button>
                  </div>

                  <div class="row mt-4">
                    <div
                      class="col-6 d-flex mb-4"
                      v-for="(names, index) in service.document_names"
                      :key="index"
                    >
                      <input
                        type="text"
                        class="form-control"
                        id="price"
                        :placeholder="`Document ${index + 1} Name`"
                        v-model="service.document_names[index].name"
                      />

                      <button
                        class="
                          btn btn-danger btn-md btn-icon
                          waves-effect waves-light
                          ms-2
                        "
                        type="button"
                        @click="removeDocument(index)"
                      >
                        <div class="btn-content">
                          <i class="ri-delete-bin-5-line"></i>
                        </div>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div class="text-end float-end">
              <button
                type="submit"
                 class="btn btn-primary align-items-center d-flex justify-content-center"
                @click="saveService"
              >
                {{title}} Service
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
<style scoped>
.image-root-div {
  position: relative;
  height: 90px;
  width: 80px;
}
.image-block-edit-icon {
  position: absolute;
  color: #11132d;
  left: 0;
  background: #adb5bd;
  font-size: 16px;
  border-radius: 50%;
  height: 25px;
  width: 25px;
  display: flex;
  padding-left: 6px;
  padding-top: 4px;
  top: -10px;
}

.image-block-inside {
  object-fit: cover;
  width: 100%;
  border-radius: 0.75rem;
  height: 100%;
  margin-left: 10px;
}
/* 
.rounded-xl {
    border-radius: 0.75rem;
} */
</style>
