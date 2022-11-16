<script>
import {
  required,
  email,
  helpers,
  numeric,
  sameAs,
} from "@vuelidate/validators";
import useVuelidate from "@vuelidate/core";
import appConfig from "../../../app.config";
import { mapActions } from "vuex";
import {
  getAuth,
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from "firebase/auth";
export default {
  setup() {
    return {
      v$: useVuelidate(),
    };
  },
  page: {
    title: "Register",
    meta: [
      {
        name: "description",
        content: appConfig.description,
      },
    ],
  },
  components: {},
  data() {
    return {
      user: {
        name: "",
        email: "",
        password: "",
        confirm_password: "",
        phone: "",
      },
      otp:null,
      isSubmited: false,
      regError: null,
      tryingToRegister: false,
      isRegisterError: false,
      registerSuccess: false,
      countryCode: "+91",
      countrylist: [
        {
          id: 1,
          flagImg: require("@/assets/images/flags/ac.svg"),
          countryName: "Ascension Island",
          countryCode: "+247",
        },
        {
          id: 2,
          flagImg: require("@/assets/images/flags/ad.svg"),
          countryName: "Andorra",
          countryCode: "+376",
        },
        {
          id: 3,
          flagImg: require("@/assets/images/flags/ae.svg"),
          countryName: "United Arab Emirates",
          countryCode: "+971",
        },
        {
          id: 4,
          flagImg: require("@/assets/images/flags/af.svg"),
          countryName: "Afghanistan",
          countryCode: "+93",
        },
        {
          id: 5,
          flagImg: require("@/assets/images/flags/ag.svg"),
          countryName: "Antigua and Barbuda",
          countryCode: "+93",
        },
        {
          id: 6,
          flagImg: require("@/assets/images/flags/ai.svg"),
          countryName: "Anguilla",
          countryCode: "+1",
        },
        {
          id: 7,
          flagImg: require("@/assets/images/flags/am.svg"),
          countryName: "Armenia",
          countryCode: "+374",
        },
        {
          id: 8,
          flagImg: require("@/assets/images/flags/ao.svg"),
          countryName: "Angola",
          countryCode: "+244",
        },
        {
          id: 9,
          flagImg: require("@/assets/images/flags/aq.svg"),
          countryName: "Antarctica",
          countryCode: "+672",
        },
        {
          id: 10,
          flagImg: require("@/assets/images/flags/ar.svg"),
          countryName: "Argentina",
          countryCode: "+54",
        },
        {
          id: 11,
          flagImg: require("@/assets/images/flags/as.svg"),
          countryName: "American Samoa",
          countryCode: "+1",
        },
        {
          id: 12,
          flagImg: require("@/assets/images/flags/at.svg"),
          countryName: "Austria",
          countryCode: "+43",
        },
        {
          id: 13,
          flagImg: require("@/assets/images/flags/au.svg"),
          countryName: "Australia",
          countryCode: "+61",
        },
        {
          id: 14,
          flagImg: require("@/assets/images/flags/aw.svg"),
          countryName: "Aruba",
          countryCode: "+297",
        },
        {
          id: 15,
          flagImg: require("@/assets/images/flags/ax.svg"),
          countryName: "Aland Islands",
          countryCode: "+358",
        },
        {
          id: 16,
          flagImg: require("@/assets/images/flags/ba.svg"),
          countryName: "Bosnia and Herzegovina",
          countryCode: "+387",
        },
        {
          id: 17,
          flagImg: require("@/assets/images/flags/bb.svg"),
          countryName: "Barbados",
          countryCode: "+1",
        },
        {
          id: 18,
          flagImg: require("@/assets/images/flags/bd.svg"),
          countryName: "Bangladesh",
          countryCode: "+880",
        },
        {
          id: 19,
          flagImg: require("@/assets/images/flags/be.svg"),
          countryName: "Belgium",
          countryCode: "+32",
        },
        {
          id: 20,
          flagImg: require("@/assets/images/flags/bf.svg"),
          countryName: "Burkina Faso",
          countryCode: "+226",
        },
        {
          id: 21,
          flagImg: require("@/assets/images/flags/bf.svg"),
          countryName: "Bulgaria",
          countryCode: "+359",
        },
        {
          id: 22,
          flagImg: require("@/assets/images/flags/bh.svg"),
          countryName: "Bahrain",
          countryCode: "+973",
        },
        {
          id: 23,
          flagImg: require("@/assets/images/flags/bi.svg"),
          countryName: "Burundi",
          countryCode: "+257",
        },
        {
          id: 24,
          flagImg: require("@/assets/images/flags/bj.svg"),
          countryName: "Benin",
          countryCode: "+229",
        },
        {
          id: 25,
          flagImg: require("@/assets/images/flags/bl.svg"),
          countryName: "Saint Barthélemy",
          countryCode: "+590",
        },
        {
          id: 26,
          flagImg: require("@/assets/images/flags/bm.svg"),
          countryName: "Bermuda",
          countryCode: "+1",
        },
        {
          id: 27,
          flagImg: require("@/assets/images/flags/bn.svg"),
          countryName: "Brunei Darussalam",
          countryCode: "+673",
        },
        {
          id: 28,
          flagImg: require("@/assets/images/flags/bo.svg"),
          countryName: "Bolivia (Plurinational State of)",
          countryCode: "+591",
        },
        {
          id: 29,
          flagImg: require("@/assets/images/flags/bq.svg"),
          countryName: "Bonaire, Sint Eustatius and Saba",
          countryCode: "+599",
        },
        {
          id: 30,
          flagImg: require("@/assets/images/flags/br.svg"),
          countryName: "Brazil",
          countryCode: "+55",
        },
        {
          id: 31,
          flagImg: require("@/assets/images/flags/bs.svg"),
          countryName: "Bahamas",
          countryCode: "+1",
        },
        {
          id: 32,
          flagImg: require("@/assets/images/flags/bt.svg"),
          countryName: "Bhutan",
          countryCode: "+975",
        },
        {
          id: 33,
          flagImg: require("@/assets/images/flags/bv.svg"),
          countryName: "Bouvet Island",
          countryCode: "+47",
        },
        {
          id: 34,
          flagImg: require("@/assets/images/flags/bw.svg"),
          countryName: "Botswana",
          countryCode: "+267",
        },
        {
          id: 35,
          flagImg: require("@/assets/images/flags/by.svg"),
          countryName: "Belarus",
          countryCode: "+375",
        },
        {
          id: 36,
          flagImg: require("@/assets/images/flags/bz.svg"),
          countryName: "Belize",
          countryCode: "+501",
        },
        {
          id: 37,
          flagImg: require("@/assets/images/flags/ca.svg"),
          countryName: "Canada",
          countryCode: "+1",
        },
        {
          id: 38,
          flagImg: require("@/assets/images/flags/cc.svg"),
          countryName: "Cocos (Keeling) Island",
          countryCode: "+61",
        },
        {
          id: 39,
          flagImg: require("@/assets/images/flags/cd.svg"),
          countryName: "Democratic Republic of the Congo",
          countryCode: "+243",
        },
        {
          id: 40,
          flagImg: require("@/assets/images/flags/cf.svg"),
          countryName: "Central African Republic",
          countryCode: "+236",
        },
        {
          id: 41,
          flagImg: require("@/assets/images/flags/cg.svg"),
          countryName: "Republic of the Congo",
          countryCode: "+243",
        },
        {
          id: 42,
          flagImg: require("@/assets/images/flags/ch.svg"),
          countryName: "Switzerland",
          countryCode: "+41",
        },
        {
          id: 43,
          flagImg: require("@/assets/images/flags/ci.svg"),
          countryName: "Ivory Coast",
          countryCode: "+225",
        },
        {
          id: 44,
          flagImg: require("@/assets/images/flags/ck.svg"),
          countryName: "Cook Islands",
          countryCode: "+682",
        },
        {
          id: 45,
          flagImg: require("@/assets/images/flags/cl.svg"),
          countryName: "Chile",
          countryCode: "+56",
        },
        {
          id: 46,
          flagImg: require("@/assets/images/flags/cm.svg"),
          countryName: "Cameroon",
          countryCode: "+237",
        },
        {
          id: 47,
          flagImg: require("@/assets/images/flags/cn.svg"),
          countryName: "China",
          countryCode: "+86",
        },
        {
          id: 48,
          flagImg: require("@/assets/images/flags/co.svg"),
          countryName: "Colombia",
          countryCode: "+57",
        },
        {
          id: 49,
          flagImg: require("@/assets/images/flags/cp.svg"),
          countryName: "Clipperton Island",
          countryCode: "+55",
        },
        {
          id: 50,
          flagImg: require("@/assets/images/flags/cr.svg"),
          countryName: "Costa Rica",
          countryCode: "+506",
        },
        {
          id: 51,
          flagImg: require("@/assets/images/flags/cu.svg"),
          countryName: "Cuba",
          countryCode: "+53",
        },
        {
          id: 52,
          flagImg: require("@/assets/images/flags/cv.svg"),
          countryName: "Cabo Verde",
          countryCode: "+238",
        },
        {
          id: 53,
          flagImg: require("@/assets/images/flags/cw.svg"),
          countryName: "Curaçao",
          countryCode: "+599",
        },
        {
          id: 54,
          flagImg: require("@/assets/images/flags/cx.svg"),
          countryName: "Christmas Island",
          countryCode: "+61",
        },
        {
          id: 55,
          flagImg: require("@/assets/images/flags/cy.svg"),
          countryName: "Cyprus",
          countryCode: "+357",
        },
        {
          id: 56,
          flagImg: require("@/assets/images/flags/cz.svg"),
          countryName: "Czech Republic",
          countryCode: "+420",
        },
        {
          id: 57,
          flagImg: require("@/assets/images/flags/de.svg"),
          countryName: "Germany",
          countryCode: "+49",
        },
        {
          id: 58,
          flagImg: require("@/assets/images/flags/dg.svg"),
          countryName: "Diego Garcia",
          countryCode: "+246",
        },
        {
          id: 59,
          flagImg: require("@/assets/images/flags/dj.svg"),
          countryName: "Djibouti",
          countryCode: "+253",
        },
        {
          id: 60,
          flagImg: require("@/assets/images/flags/dk.svg"),
          countryName: "Denmark",
          countryCode: "+45",
        },
        {
          id: 61,
          flagImg: require("@/assets/images/flags/dm.svg"),
          countryName: "Dominica",
          countryCode: "+1",
        },
        {
          id: 62,
          flagImg: require("@/assets/images/flags/do.svg"),
          countryName: "Dominican Republic",
          countryCode: "+1",
        },
        {
          id: 63,
          flagImg: require("@/assets/images/flags/dz.svg"),
          countryName: "Algeria",
          countryCode: "+213",
        },
        {
          id: 64,
          flagImg: require("@/assets/images/flags/ea.svg"),
          countryName: "Ceuta & Melilla",
          countryCode: "34",
        },
        {
          id: 65,
          flagImg: require("@/assets/images/flags/ec.svg"),
          countryName: "Ecuador",
          countryCode: "+593",
        },
        {
          id: 66,
          flagImg: require("@/assets/images/flags/ee.svg"),
          countryName: "Estonia",
          countryCode: "+372",
        },
        {
          id: 67,
          flagImg: require("@/assets/images/flags/eg.svg"),
          countryName: "Egypt",
          countryCode: "+20",
        },
        {
          id: 68,
          flagImg: require("@/assets/images/flags/eh.svg"),
          countryName: "Western Sahara",
          countryCode: "+212",
        },
        {
          id: 69,
          flagImg: require("@/assets/images/flags/er.svg"),
          countryName: "Eritrea",
          countryCode: "+291",
        },
        {
          id: 70,
          flagImg: require("@/assets/images/flags/es.svg"),
          countryName: "Spain",
          countryCode: "+34",
        },
        {
          id: 71,
          flagImg: require("@/assets/images/flags/es-ct.svg"),
          countryName: "Catalonia",
          countryCode: "+34",
        },
        {
          id: 72,
          flagImg: require("@/assets/images/flags/es-ga.svg"),
          countryName: "Galicia",
          countryCode: "+34",
        },
        {
          id: 73,
          flagImg: require("@/assets/images/flags/et.svg"),
          countryName: "Ethiopia",
          countryCode: "+251",
        },
        {
          id: 74,
          flagImg: require("@/assets/images/flags/eu.svg"),
          countryName: "Europe",
          countryCode: "+3",
        },
        {
          id: 75,
          flagImg: require("@/assets/images/flags/fi.svg"),
          countryName: "Finland",
          countryCode: "+358",
        },
        {
          id: 76,
          flagImg: require("@/assets/images/flags/fj.svg"),
          countryName: "Fiji",
          countryCode: "+679",
        },
        {
          id: 77,
          flagImg: require("@/assets/images/flags/fk.svg"),
          countryName: "Falkland Islands",
          countryCode: "+500",
        },
        {
          id: 78,
          flagImg: require("@/assets/images/flags/fm.svg"),
          countryName: "Federated States of Micronesia",
          countryCode: "+691",
        },
        {
          id: 79,
          flagImg: require("@/assets/images/flags/fo.svg"),
          countryName: "Faroe Islands",
          countryCode: "+298",
        },
        {
          id: 80,
          flagImg: require("@/assets/images/flags/fr.svg"),
          countryName: "France",
          countryCode: "+33",
        },
        {
          id: 81,
          flagImg: require("@/assets/images/flags/ga.svg"),
          countryName: "Gabon",
          countryCode: "+241",
        },
        {
          id: 82,
          flagImg: require("@/assets/images/flags/gb-eng.svg"),
          countryName: "England",
          countryCode: "+44",
        },
        {
          id: 83,
          flagImg: require("@/assets/images/flags/gb-nir.svg"),
          countryName: "Northern Ireland",
          countryCode: "+44",
        },
        {
          id: 84,
          flagImg: require("@/assets/images/flags/gb-sct.svg"),
          countryName: "Scotland",
          countryCode: "+44",
        },
        {
          id: 85,
          flagImg: require("@/assets/images/flags/gb-wls.svg"),
          countryName: "Wales",
          countryCode: "+44",
        },
        {
          id: 86,
          flagImg: require("@/assets/images/flags/gd.svg"),
          countryName: "Grenada",
          countryCode: "+1",
        },
        {
          id: 87,
          flagImg: require("@/assets/images/flags/ge.svg"),
          countryName: "Georgia",
          countryCode: "+995",
        },
        {
          id: 88,
          flagImg: require("@/assets/images/flags/gf.svg"),
          countryName: "French Guiana",
          countryCode: "+594",
        },
        {
          id: 99,
          flagImg: require("@/assets/images/flags/gg.svg"),
          countryName: "Guernsey",
          countryCode: "+44",
        },
        {
          id: 90,
          flagImg: require("@/assets/images/flags/gh.svg"),
          countryName: "Ghana",
          countryCode: "+233",
        },
        {
          id: 91,
          flagImg: require("@/assets/images/flags/gi.svg"),
          countryName: "Gibraltar",
          countryCode: "+350",
        },
        {
          id: 92,
          flagImg: require("@/assets/images/flags/gl.svg"),
          countryName: "Greenland",
          countryCode: "+299",
        },
        {
          id: 93,
          flagImg: require("@/assets/images/flags/gm.svg"),
          countryName: "Gambia",
          countryCode: "+220",
        },
        {
          id: 94,
          flagImg: require("@/assets/images/flags/gn.svg"),
          countryName: "Guinea",
          countryCode: "+224",
        },
        {
          id: 95,
          flagImg: require("@/assets/images/flags/gp.svg"),
          countryName: "Guadeloupe",
          countryCode: "+590",
        },
        {
          id: 96,
          flagImg: require("@/assets/images/flags/gq.svg"),
          countryName: "Equatorial Guinea",
          countryCode: "+240",
        },
        {
          id: 97,
          flagImg: require("@/assets/images/flags/gr.svg"),
          countryName: "Greece",
          countryCode: "+30",
        },
        {
          id: 98,
          flagImg: require("@/assets/images/flags/gs.svg"),
          countryName: "South Georgia and the South Sandwich Islands",
          countryCode: "+500",
        },
        {
          id: 99,
          flagImg: require("@/assets/images/flags/gt.svg"),
          countryName: "Guatemala",
          countryCode: "+502",
        },
        {
          id: 100,
          flagImg: require("@/assets/images/flags/gu.svg"),
          countryName: "Guam",
          countryCode: "+1",
        },
        {
          id: 101,
          flagImg: require("@/assets/images/flags/gw.svg"),
          countryName: "Guinea-Bissau",
          countryCode: "+245",
        },
        {
          id: 102,
          flagImg: require("@/assets/images/flags/gy.svg"),
          countryName: "Guyana",
          countryCode: "+592",
        },
        {
          id: 103,
          flagImg: require("@/assets/images/flags/hk.svg"),
          countryName: "Hong Kong",
          countryCode: "+852",
        },
        {
          id: 104,
          flagImg: require("@/assets/images/flags/hn.svg"),
          countryName: "Honduras",
          countryCode: "+504",
        },
        {
          id: 105,
          flagImg: require("@/assets/images/flags/hr.svg"),
          countryName: "Croatia",
          countryCode: "+385",
        },
        {
          id: 106,
          flagImg: require("@/assets/images/flags/ht.svg"),
          countryName: "Haiti",
          countryCode: "+509",
        },
        {
          id: 107,
          flagImg: require("@/assets/images/flags/hu.svg"),
          countryName: "Hungary",
          countryCode: "+36",
        },
        {
          id: 108,
          flagImg: require("@/assets/images/flags/id.svg"),
          countryName: "Indonesia",
          countryCode: "+62",
        },
        {
          id: 109,
          flagImg: require("@/assets/images/flags/ie.svg"),
          countryName: "Ireland",
          countryCode: "+353",
        },
        {
          id: 110,
          flagImg: require("@/assets/images/flags/il.svg"),
          countryName: "Israel",
          countryCode: "+972",
        },
        {
          id: 111,
          flagImg: require("@/assets/images/flags/im.svg"),
          countryName: "Isle of Man",
          countryCode: "+44",
        },
        {
          id: 112,
          flagImg: require("@/assets/images/flags/in.svg"),
          countryName: "India",
          countryCode: "+91",
        },
        {
          id: 113,
          flagImg: require("@/assets/images/flags/io.svg"),
          countryName: "British Indian Ocean Territory",
          countryCode: "+246",
        },
        {
          id: 114,
          flagImg: require("@/assets/images/flags/iq.svg"),
          countryName: "Iraq",
          countryCode: "+964",
        },
        {
          id: 115,
          flagImg: require("@/assets/images/flags/ir.svg"),
          countryName: "Iran (Islamic Republic of)",
          countryCode: "+98",
        },
        {
          id: 116,
          flagImg: require("@/assets/images/flags/is.svg"),
          countryName: "Iceland",
          countryCode: "+354",
        },
        {
          id: 117,
          flagImg: require("@/assets/images/flags/it.svg"),
          countryName: "Italy",
          countryCode: "+39",
        },
        {
          id: 118,
          flagImg: require("@/assets/images/flags/je.svg"),
          countryName: "Jersey",
          countryCode: "+44",
        },
        {
          id: 119,
          flagImg: require("@/assets/images/flags/jm.svg"),
          countryName: "Jamaica",
          countryCode: "+1",
        },
        {
          id: 120,
          flagImg: require("@/assets/images/flags/jo.svg"),
          countryName: "Jordan",
          countryCode: "+962",
        },
        {
          id: 121,
          flagImg: require("@/assets/images/flags/jp.svg"),
          countryName: "Japan",
          countryCode: "+81",
        },
        {
          id: 122,
          flagImg: require("@/assets/images/flags/ke.svg"),
          countryName: "Kenya",
          countryCode: "+254",
        },
        {
          id: 123,
          flagImg: require("@/assets/images/flags/kg.svg"),
          countryName: "Kyrgyzstan",
          countryCode: "+996",
        },
        {
          id: 124,
          flagImg: require("@/assets/images/flags/kh.svg"),
          countryName: "Cambodia",
          countryCode: "+855",
        },
        {
          id: 125,
          flagImg: require("@/assets/images/flags/ki.svg"),
          countryName: "Kiribati",
          countryCode: "+686",
        },
        {
          id: 126,
          flagImg: require("@/assets/images/flags/km.svg"),
          countryName: "Comoros",
          countryCode: "+269",
        },
        {
          id: 127,
          flagImg: require("@/assets/images/flags/kn.svg"),
          countryName: "Saint Kitts and Nevis",
          countryCode: "+1",
        },
        {
          id: 128,
          flagImg: require("@/assets/images/flags/kp.svg"),
          countryName: "North Korea",
          countryCode: "+850",
        },
        {
          id: 129,
          flagImg: require("@/assets/images/flags/kr.svg"),
          countryName: "South Korea",
          countryCode: "+82",
        },
        {
          id: 130,
          flagImg: require("@/assets/images/flags/kw.svg"),
          countryName: "Kuwait",
          countryCode: "+965",
        },
        {
          id: 131,
          flagImg: require("@/assets/images/flags/ky.svg"),
          countryName: "Cayman Islands",
          countryCode: "+1",
        },
        {
          id: 132,
          flagImg: require("@/assets/images/flags/kz.svg"),
          countryName: "Kazakhstan",
          countryCode: "+7",
        },
        {
          id: 133,
          flagImg: require("@/assets/images/flags/la.svg"),
          countryName: "Laos",
          countryCode: "+856",
        },
        {
          id: 134,
          flagImg: require("@/assets/images/flags/lb.svg"),
          countryName: "Lebanon",
          countryCode: "+961",
        },
        {
          id: 135,
          flagImg: require("@/assets/images/flags/lc.svg"),
          countryName: "Saint Lucia",
          countryCode: "+1",
        },
        {
          id: 136,
          flagImg: require("@/assets/images/flags/li.svg"),
          countryName: "Liechtenstein",
          countryCode: "+423",
        },
        {
          id: 137,
          flagImg: require("@/assets/images/flags/lk.svg"),
          countryName: "Sri Lanka",
          countryCode: "+94",
        },
        {
          id: 138,
          flagImg: require("@/assets/images/flags/lr.svg"),
          countryName: "Liberia",
          countryCode: "+231",
        },
        {
          id: 139,
          flagImg: require("@/assets/images/flags/ls.svg"),
          countryName: "Lesotho",
          countryCode: "+266",
        },
        {
          id: 140,
          flagImg: require("@/assets/images/flags/lt.svg"),
          countryName: "Lithuania",
          countryCode: "+370",
        },
        {
          id: 141,
          flagImg: require("@/assets/images/flags/lu.svg"),
          countryName: "Luxembourg",
          countryCode: "+352",
        },
        {
          id: 142,
          flagImg: require("@/assets/images/flags/lv.svg"),
          countryName: "Latvia",
          countryCode: "+371",
        },
        {
          id: 143,
          flagImg: require("@/assets/images/flags/ly.svg"),
          countryName: "Libya",
          countryCode: "+218",
        },
        {
          id: 144,
          flagImg: require("@/assets/images/flags/ma.svg"),
          countryName: "Morocco",
          countryCode: "+212",
        },
        {
          id: 145,
          flagImg: require("@/assets/images/flags/mc.svg"),
          countryName: "Monaco",
          countryCode: "+377",
        },
        {
          id: 146,
          flagImg: require("@/assets/images/flags/md.svg"),
          countryName: "Moldova",
          countryCode: "+373",
        },
        {
          id: 147,
          flagImg: require("@/assets/images/flags/me.svg"),
          countryName: "Montenegro",
          countryCode: "+382",
        },
        {
          id: 148,
          flagImg: require("@/assets/images/flags/mf.svg"),
          countryName: "Saint Martin",
          countryCode: "+721",
        },
        {
          id: 149,
          flagImg: require("@/assets/images/flags/mg.svg"),
          countryName: "Madagascar",
          countryCode: "+261",
        },
        {
          id: 150,
          flagImg: require("@/assets/images/flags/mh.svg"),
          countryName: "Marshall Islands",
          countryCode: "+692",
        },
        {
          id: 151,
          flagImg: require("@/assets/images/flags/mk.svg"),
          countryName: "North Macedonia",
          countryCode: "+389",
        },
        {
          id: 152,
          flagImg: require("@/assets/images/flags/ml.svg"),
          countryName: "Mali",
          countryCode: "+223",
        },
        {
          id: 153,
          flagImg: require("@/assets/images/flags/mm.svg"),
          countryName: "Myanmar",
          countryCode: "+95",
        },
        {
          id: 154,
          flagImg: require("@/assets/images/flags/mn.svg"),
          countryName: "Mongolia",
          countryCode: "+976",
        },
        {
          id: 155,
          flagImg: require("@/assets/images/flags/mo.svg"),
          countryName: "Macau",
          countryCode: "+853",
        },
        {
          id: 156,
          flagImg: require("@/assets/images/flags/mp.svg"),
          countryName: "Northern Mariana Islands",
          countryCode: "+1",
        },
        {
          id: 157,
          flagImg: require("@/assets/images/flags/mq.svg"),
          countryName: "Martinique",
          countryCode: "+596",
        },
        {
          id: 158,
          flagImg: require("@/assets/images/flags/mr.svg"),
          countryName: "Mauritania",
          countryCode: "+222",
        },
        {
          id: 159,
          flagImg: require("@/assets/images/flags/ms.svg"),
          countryName: "Montserrat",
          countryCode: "+1",
        },
        {
          id: 160,
          flagImg: require("@/assets/images/flags/mt.svg"),
          countryName: "Malta",
          countryCode: "+356",
        },
        {
          id: 161,
          flagImg: require("@/assets/images/flags/mu.svg"),
          countryName: "Mauritius",
          countryCode: "+230",
        },
        {
          id: 162,
          flagImg: require("@/assets/images/flags/mv.svg"),
          countryName: "Maldives",
          countryCode: "+960",
        },
        {
          id: 163,
          flagImg: require("@/assets/images/flags/mw.svg"),
          countryName: "Malawi",
          countryCode: "+265",
        },
        {
          id: 164,
          flagImg: require("@/assets/images/flags/mx.svg"),
          countryName: "Mexico",
          countryCode: "+52",
        },
        {
          id: 165,
          flagImg: require("@/assets/images/flags/my.svg"),
          countryName: "Malaysia",
          countryCode: "+60",
        },
        {
          id: 166,
          flagImg: require("@/assets/images/flags/mz.svg"),
          countryName: "Mozambique",
          countryCode: "+258",
        },
        {
          id: 167,
          flagImg: require("@/assets/images/flags/na.svg"),
          countryName: "Namibia",
          countryCode: "+264",
        },
        {
          id: 168,
          flagImg: require("@/assets/images/flags/nc.svg"),
          countryName: "New Caledonia",
          countryCode: "+687",
        },
        {
          id: 169,
          flagImg: require("@/assets/images/flags/ne.svg"),
          countryName: "Niger",
          countryCode: "+227",
        },
        {
          id: 170,
          flagImg: require("@/assets/images/flags/nf.svg"),
          countryName: "Norfolk Island",
          countryCode: "+672",
        },
        {
          id: 171,
          flagImg: require("@/assets/images/flags/ng.svg"),
          countryName: "Nigeria",
          countryCode: "+234",
        },
        {
          id: 172,
          flagImg: require("@/assets/images/flags/ni.svg"),
          countryName: "Nicaragua",
          countryCode: "+505",
        },
        {
          id: 173,
          flagImg: require("@/assets/images/flags/nl.svg"),
          countryName: "Netherlands",
          countryCode: "+31",
        },
        {
          id: 174,
          flagImg: require("@/assets/images/flags/no.svg"),
          countryName: "Norway",
          countryCode: "+47",
        },
        {
          id: 175,
          flagImg: require("@/assets/images/flags/np.svg"),
          countryName: "Nepal",
          countryCode: "+977",
        },
        {
          id: 176,
          flagImg: require("@/assets/images/flags/nr.svg"),
          countryName: "Nauru",
          countryCode: "+674",
        },
        {
          id: 177,
          flagImg: require("@/assets/images/flags/nu.svg"),
          countryName: "Niue",
          countryCode: "+683",
        },
        {
          id: 178,
          flagImg: require("@/assets/images/flags/nz.svg"),
          countryName: "New Zealand",
          countryCode: "+64",
        },
        {
          id: 179,
          flagImg: require("@/assets/images/flags/om.svg"),
          countryName: "Oman",
          countryCode: "+968",
        },
        {
          id: 180,
          flagImg: require("@/assets/images/flags/pa.svg"),
          countryName: "Panama",
          countryCode: "+507",
        },
        {
          id: 181,
          flagImg: require("@/assets/images/flags/pe.svg"),
          countryName: "Peru",
          countryCode: "+51",
        },
        {
          id: 182,
          flagImg: require("@/assets/images/flags/pf.svg"),
          countryName: "French Polynesia",
          countryCode: "+689",
        },
        {
          id: 183,
          flagImg: require("@/assets/images/flags/pg.svg"),
          countryName: "Papua New Guinea",
          countryCode: "+675",
        },
        {
          id: 184,
          flagImg: require("@/assets/images/flags/ph.svg"),
          countryName: "Philippines",
          countryCode: "+63",
        },
        {
          id: 185,
          flagImg: require("@/assets/images/flags/pk.svg"),
          countryName: "Pakistan",
          countryCode: "+92",
        },
        {
          id: 186,
          flagImg: require("@/assets/images/flags/pl.svg"),
          countryName: "Poland",
          countryCode: "+48",
        },
        {
          id: 187,
          flagImg: require("@/assets/images/flags/pm.svg"),
          countryName: "Saint Pierre and Miquelon",
          countryCode: "+508",
        },
        {
          id: 188,
          flagImg: require("@/assets/images/flags/pn.svg"),
          countryName: "Pitcairn",
          countryCode: "+64",
        },
        {
          id: 189,
          flagImg: require("@/assets/images/flags/pr.svg"),
          countryName: "Puerto Rico",
          countryCode: "+1",
        },
        {
          id: 190,
          flagImg: require("@/assets/images/flags/ps.svg"),
          countryName: "State of Palestine",
          countryCode: "+970",
        },
        {
          id: 191,
          flagImg: require("@/assets/images/flags/pt.svg"),
          countryName: "Portugal",
          countryCode: "+351",
        },
        {
          id: 192,
          flagImg: require("@/assets/images/flags/pw.svg"),
          countryName: "Palau",
          countryCode: "+680",
        },
        {
          id: 193,
          flagImg: require("@/assets/images/flags/py.svg"),
          countryName: "Paraguay",
          countryCode: "+595",
        },
        {
          id: 194,
          flagImg: require("@/assets/images/flags/qa.svg"),
          countryName: "Qatar",
          countryCode: "+974",
        },
        {
          id: 195,
          flagImg: require("@/assets/images/flags/re.svg"),
          countryName: "Réunion",
          countryCode: "+262",
        },
        {
          id: 196,
          flagImg: require("@/assets/images/flags/ro.svg"),
          countryName: "Romania",
          countryCode: "+40",
        },
        {
          id: 197,
          flagImg: require("@/assets/images/flags/rs.svg"),
          countryName: "Serbia",
          countryCode: "+381",
        },
        {
          id: 198,
          flagImg: require("@/assets/images/flags/ru.svg"),
          countryName: "Russia",
          countryCode: "+7",
        },
        {
          id: 199,
          flagImg: require("@/assets/images/flags/rw.svg"),
          countryName: "Rwanda",
          countryCode: "+250",
        },
        {
          id: 200,
          flagImg: require("@/assets/images/flags/sa.svg"),
          countryName: "Saudi Arabia",
          countryCode: "+966",
        },
        {
          id: 201,
          flagImg: require("@/assets/images/flags/sb.svg"),
          countryName: "Solomon Islands",
          countryCode: "+677",
        },
        {
          id: 202,
          flagImg: require("@/assets/images/flags/sc.svg"),
          countryName: "Seychelles",
          countryCode: "+248",
        },
        {
          id: 203,
          flagImg: require("@/assets/images/flags/sd.svg"),
          countryName: "Sudan",
          countryCode: "+249",
        },
        {
          id: 204,
          flagImg: require("@/assets/images/flags/se.svg"),
          countryName: "Sweden",
          countryCode: "+46",
        },
        {
          id: 205,
          flagImg: require("@/assets/images/flags/sg.svg"),
          countryName: "Singapore",
          countryCode: "+65",
        },
        {
          id: 207,
          flagImg: require("@/assets/images/flags/si.svg"),
          countryName: "Slovenia",
          countryCode: "+386",
        },
        {
          id: 208,
          flagImg: require("@/assets/images/flags/sj.svg"),
          countryName: "Svalbard and Jan Mayen",
          countryCode: "47",
        },
        {
          id: 209,
          flagImg: require("@/assets/images/flags/sk.svg"),
          countryName: "Slovakia",
          countryCode: "+421",
        },
        {
          id: 210,
          flagImg: require("@/assets/images/flags/sl.svg"),
          countryName: "Sierra Leone",
          countryCode: "+232",
        },
        {
          id: 212,
          flagImg: require("@/assets/images/flags/sm.svg"),
          countryName: "San Marino",
          countryCode: "+378",
        },
        {
          id: 213,
          flagImg: require("@/assets/images/flags/sn.svg"),
          countryName: "Senegal",
          countryCode: "+221",
        },
        {
          id: 214,
          flagImg: require("@/assets/images/flags/so.svg"),
          countryName: "Somalia",
          countryCode: "+252",
        },
        {
          id: 215,
          flagImg: require("@/assets/images/flags/sr.svg"),
          countryName: "Suriname",
          countryCode: "+597",
        },
        {
          id: 216,
          flagImg: require("@/assets/images/flags/ss.svg"),
          countryName: "South Sudan",
          countryCode: "+211",
        },
        {
          id: 217,
          flagImg: require("@/assets/images/flags/st.svg"),
          countryName: "Sao Tome and Principe",
          countryCode: "+239",
        },
        {
          id: 218,
          flagImg: require("@/assets/images/flags/sv.svg"),
          countryName: "El Salvador",
          countryCode: "+503",
        },
        {
          id: 219,
          flagImg: require("@/assets/images/flags/sx.svg"),
          countryName: "Sint Maarten",
          countryCode: "+721",
        },
        {
          id: 220,
          flagImg: require("@/assets/images/flags/sy.svg"),
          countryName: "Syria",
          countryCode: "+963",
        },
        {
          id: 221,
          flagImg: require("@/assets/images/flags/sz.svg"),
          countryName: "Eswatini",
          countryCode: "+268",
        },
        {
          id: 222,
          flagImg: require("@/assets/images/flags/ta.svg"),
          countryName: "Tristan da Cunha",
          countryCode: "+290",
        },
        {
          id: 223,
          flagImg: require("@/assets/images/flags/tc.svg"),
          countryName: "Turks and Caicos Islands",
          countryCode: "+1",
        },
        {
          id: 224,
          flagImg: require("@/assets/images/flags/td.svg"),
          countryName: "Chad",
          countryCode: "+235",
        },
        {
          id: 225,
          flagImg: require("@/assets/images/flags/tg.svg"),
          countryName: "Togo",
          countryCode: "+228",
        },
        {
          id: 226,
          flagImg: require("@/assets/images/flags/th.svg"),
          countryName: "Thailand",
          countryCode: "+66",
        },
        {
          id: 227,
          flagImg: require("@/assets/images/flags/tj.svg"),
          countryName: "Tajikistan",
          countryCode: "+992",
        },
        {
          id: 228,
          flagImg: require("@/assets/images/flags/tk.svg"),
          countryName: "Tokelau",
          countryCode: "+690",
        },
        {
          id: 229,
          flagImg: require("@/assets/images/flags/tl.svg"),
          countryName: "Timor-Leste",
          countryCode: "+670",
        },
        {
          id: 230,
          flagImg: require("@/assets/images/flags/tm.svg"),
          countryName: "Turkmenistan",
          countryCode: "+993",
        },
        {
          id: 231,
          flagImg: require("@/assets/images/flags/tn.svg"),
          countryName: "Tunisia",
          countryCode: "+216",
        },
        {
          id: 232,
          flagImg: require("@/assets/images/flags/to.svg"),
          countryName: "Tonga",
          countryCode: "+676",
        },
        {
          id: 233,
          flagImg: require("@/assets/images/flags/tr.svg"),
          countryName: "Turkey",
          countryCode: "+90",
        },
        {
          id: 234,
          flagImg: require("@/assets/images/flags/tt.svg"),
          countryName: "Trinidad and Tobago",
          countryCode: "+1",
        },
        {
          id: 235,
          flagImg: require("@/assets/images/flags/tv.svg"),
          countryName: "Tuvalu",
          countryCode: "+688",
        },
        {
          id: 236,
          flagImg: require("@/assets/images/flags/tw.svg"),
          countryName: "Taiwan",
          countryCode: "+886",
        },
        {
          id: 237,
          flagImg: require("@/assets/images/flags/tz.svg"),
          countryName: "Tanzania",
          countryCode: "+255",
        },
        {
          id: 238,
          flagImg: require("@/assets/images/flags/ua.svg"),
          countryName: "Ukraine",
          countryCode: "+380",
        },
        {
          id: 239,
          flagImg: require("@/assets/images/flags/ug.svg"),
          countryName: "Uganda",
          countryCode: "+256",
        },
        {
          id: 240,
          flagImg: require("@/assets/images/flags/us.svg"),
          countryName: "United States of America",
          countryCode: "+1",
        },
        {
          id: 242,
          flagImg: require("@/assets/images/flags/uy.svg"),
          countryName: "Uruguay",
          countryCode: "+598",
        },
        {
          id: 243,
          flagImg: require("@/assets/images/flags/uz.svg"),
          countryName: "Uzbekistan",
          countryCode: "+998",
        },
        {
          id: 244,
          flagImg: require("@/assets/images/flags/va.svg"),
          countryName: "Holy See",
          countryCode: "+379",
        },
        {
          id: 245,
          flagImg: require("@/assets/images/flags/vc.svg"),
          countryName: "Saint Vincent and the Grenadines",
          countryCode: "+1",
        },
        {
          id: 246,
          flagImg: require("@/assets/images/flags/ve.svg"),
          countryName: "Venezuela (Bolivarian Republic of)",
          countryCode: "+58",
        },
        {
          id: 247,
          flagImg: require("@/assets/images/flags/vg.svg"),
          countryName: "Virgin Islands (British)",
          countryCode: "+1",
        },
        {
          id: 248,
          flagImg: require("@/assets/images/flags/vi.svg"),
          countryName: "Virgin Islands (U.S.)",
          countryCode: "+1",
        },
        {
          id: 249,
          flagImg: require("@/assets/images/flags/vn.svg"),
          countryName: "Vietnam",
          countryCode: "+84",
        },
        {
          id: 250,
          flagImg: require("@/assets/images/flags/vu.svg"),
          countryName: "Vanuatu",
          countryCode: "+678",
        },
        {
          id: 251,
          flagImg: require("@/assets/images/flags/wf.svg"),
          countryName: "Wallis and Futuna",
          countryCode: "+681",
        },
        {
          id: 252,
          flagImg: require("@/assets/images/flags/ws.svg"),
          countryName: "Samoa",
          countryCode: "+685",
        },
        {
          id: 253,
          flagImg: require("@/assets/images/flags/xk.svg"),
          countryName: "Kosovo",
          countryCode: "+383",
        },
        {
          id: 254,
          flagImg: require("@/assets/images/flags/ye.svg"),
          countryName: "Yemen",
          countryCode: "+967",
        },
        {
          id: 255,
          flagImg: require("@/assets/images/flags/yt.svg"),
          countryName: "Mayotte",
          countryCode: "+262",
        },
        {
          id: 256,
          flagImg: require("@/assets/images/flags/za.svg"),
          countryName: "South Africa",
          countryCode: "+27",
        },
        {
          id: 257,
          flagImg: require("@/assets/images/flags/zm.svg"),
          countryName: "Zambia",
          countryCode: "+260",
        },
        {
          id: 258,
          flagImg: require("@/assets/images/flags/zw.svg"),
          countryName: "Zimbabwe",
          countryCode: "+263",
        },
      ],
      appVerifier: null,
      isMessageSend: false,
      showpass: true,
      cshowpass: true,
      loader: false,
      disabled: false,
    };
  },
  validations() {
    return {
      user: {
        name: {
          required: helpers.withMessage("Name is required", required),
        },
        email: {
          required: helpers.withMessage("Email is required", required),
          email: helpers.withMessage("Please enter valid email", email),
        },
        password: {
          required: helpers.withMessage("Password is required", required),
        },
        phone: {
          required: helpers.withMessage("Phone is required", required),
          numeric: helpers.withMessage("Please enter only numbers", numeric),
        },
        confirm_password: {
          sameAsPassword: sameAs(this.user.password),
        },
      },
      otp: {
        required: helpers.withMessage("Otp is required", required),
        numeric: helpers.withMessage("Please enter only numbers", numeric),
      },
    };
  },
  computed: {
    notification() {
      return this.$store ? this.$store.state.notification : null;
    },
  },
  methods: {
    ...mapActions({
      checkEmailExist: "auth/checkEmailExist",
      registerUserDb: "auth/registerUser",
    }),
    checkEmail() {
      this.loader = true;
      this.disabled = true;
      this.checkEmailExist(this.user)
        .then((res) => {
          if (res.data.status) {
            this.sendOtp();
          } else {
            this.loader = false;
            this.disabled = false;
            let message = res.data.message;
            this.$toast.open({
              message: message,
              type: "error",
            });
          }
        })
        .catch(() => {
          this.loader = false;
          this.disabled = false;
        });
    },
    async tryToRegisterIn() {
      this.isSubmited = true;
      this.v$.$touch();
      if (this.v$.user.$invalid) {
        return;
      }
      this.checkEmail();
    },
    initReCaptcha() {
      setTimeout(() => {
        const auth = getAuth();
        window.recaptchaVerifier = new RecaptchaVerifier(
          "recaptcha-container",
          {
            size: "invisible",
            callback: () => {
              // reCAPTCHA solved, allow signInWithPhoneNumber.
              // ...
            },
            "expired-callback": () => {
              // Response expired. Ask user to solve reCAPTCHA again.
              // ...
            },
          },
          auth
        );
        this.appVerifier = window.recaptchaVerifier;
      }, 1000);
    },
    sendOtp() {
      let vm = this;
      let code = document.getElementById("country-codeno-regis").innerHTML;
      let phoneNumber = code + this.user.phone;
      const auth = getAuth();
      let appVerifier = this.appVerifier;
      signInWithPhoneNumber(auth, phoneNumber, appVerifier)
        .then((confirmationResult) => {
          window.confirmationResult = confirmationResult;
          vm.$toast.open({
            message: "Message sent.",
            type: "success",
          });
          vm.isMessageSend = true;
          vm.isSubmited = false;
          vm.loader = false;
          vm.disabled = false;
        })
        .catch((error) => {
          console.log(error);
          vm.isMessageSend = false;
          vm.isSubmited = false;
          vm.loader = false;
          vm.disabled = false;
          vm.$toast.open({
            message: "Message not sent. Daily limit reached.",
            type: "error",
          });
        });
    },
    verifyOtp() {
      this.isSubmited = true;
      this.v$.otp.$touch();
      if (this.v$.otp.$invalid) {
        return;
      }
      let code = this.otp;
      this.loader = true;
      this.disabled = true;
      window.confirmationResult
        .confirm(code)
        .then((result) => {
          const user = result.user;
          this.registerUser(user);
        })
        .catch((error) => {
          console.log(error)
          this.loader = false;
          this.disabled = false;
          this.$toast.open({
            message: "Invalid Otp",
            type: "error",
          });
        });
    },
    registerUser(data){
      let payload={
          ...this.user,
          token:data.accessToken,
      }
      this.registerUserDb(payload).then((res)=>{
        this.loader=false
        this.disabled=false
        if(res.data.status){
             this.$toast.open({
              message: "Signup Successfull.",
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
  created() {
    this.initReCaptcha();
  },
  mounted() {
    function loadCountryListData(datas) {
      var mainArray = Array.from(
        document.querySelectorAll("[data-input-flag]")
      );
      var flags = "";
      var arr = Array.from(datas);
      for (let index = 0; index < arr.length; index++) {
        flags +=
          '<li class="dropdown-item d-flex">\
              <div class="flex-shrink-0 me-2"><img src="' +
          arr[index]["flagImg"] +
          '" alt="country flag" class="options-flagimg" height="20"></div>\
                  <div class="flex-grow-1">\
                  <div class="d-flex"><div class="country-name me-1">' +
          arr[index]["countryName"] +
          '</div><span class="countrylist-codeno text-muted">' +
          arr[index]["countryCode"] +
          "</span></div>\
              </div>\
              </li>";
      }
      // console.log(flags,mainArray)
      for (let i = 0; i < mainArray.length; i++) {
        mainArray[i].querySelector(".dropdown-menu-list").innerHTML = "";
        mainArray[i].querySelector(".dropdown-menu-list").innerHTML = flags;
        countryListClickEvent(mainArray[i]);
      }
    }
    function countryListClickEvent(item) {
      if (item.querySelector(".country-flagimg")) {
        var countryFlagImg = item
          .querySelector(".country-flagimg")
          .getAttribute("src");
      }
      Array.from(item.querySelectorAll(".dropdown-menu li")).forEach(function (
        subitem
      ) {
        var optionFlagImg = subitem
          .querySelector(".options-flagimg")
          .getAttribute("src");
        subitem.addEventListener("click", function () {
          var optionCodeNo = subitem.querySelector(
            ".countrylist-codeno"
          ).innerHTML;
          if (item.querySelector("button")) {
            item.querySelector("button img").setAttribute("src", optionFlagImg);
            if (item.querySelector("button span")) {
              item.querySelector("button span").innerHTML = optionCodeNo;
            }
          }
        });
        if (countryFlagImg == optionFlagImg) {
          subitem.classList.add("active");
        }
      });
      // data option flag img with name
      Array.from(
        document.querySelectorAll("[data-option-flag-img-name]")
      ).forEach(function (item) {
        var flagImg = getComputedStyle(
          item.querySelector(".flag-input")
        ).backgroundImage;
        var countryFlagImg = flagImg.substring(
          flagImg.indexOf("/as") + 1,
          flagImg.lastIndexOf('"')
        );
        Array.from(item.querySelectorAll(".dropdown-menu li")).forEach(
          function (subitem) {
            var optionFlagImg = subitem
              .querySelector(".options-flagimg")
              .getAttribute("src");
            subitem.addEventListener("click", function () {
              var optionCountryName =
                subitem.querySelector(".country-name").innerHTML;
              item.querySelector(".flag-input").style.backgroundImage =
                "url(" + optionFlagImg + ")";
              item.querySelector(".flag-input").value = optionCountryName;
            });
            if (countryFlagImg == optionFlagImg) {
              subitem.classList.add("active");
              item.querySelector(".flag-input").value =
                subitem.querySelector(".country-name").innerHTML;
            }
          }
        );
      });
      // data option flag img with name
      Array.from(document.querySelectorAll("[data-option-flag-name]")).forEach(
        function (item) {
          var countryName = item.querySelector(".flag-input").value;
          Array.from(item.querySelectorAll(".dropdown-menu li")).forEach(
            function (subitem) {
              var optionCountryName =
                subitem.querySelector(".country-name").innerHTML;
              subitem.addEventListener("click", function () {
                item.querySelector(".flag-input").value = optionCountryName;
              });
              if (countryName == optionCountryName) {
                subitem.classList.add("active");
                item.querySelector(".flag-input").value =
                  subitem.querySelector(".country-name").innerHTML;
              }
            }
          );
        }
      );
    }
    loadCountryListData(this.countrylist);
    var countryListData = this.countrylist;
    Array.from(document.querySelectorAll("[data-input-flag]")).forEach(
      function (item) {
        var searchInput = item.querySelector(".search-countryList");
        if (searchInput) {
          searchInput.addEventListener("keyup", function () {
            var inputVal = searchInput.value.toLowerCase();
            function filterItems(arr, query) {
              return arr.filter(function (el) {
                return (
                  el.countryName.toLowerCase().indexOf(query.toLowerCase()) !==
                    -1 || el.countryCode.indexOf(query) !== -1
                );
              });
            }
            var filterData = filterItems(countryListData, inputVal);
            setTimeout(function () {
              item.querySelector(".dropdown-menu-list").innerHTML = "";
              Array.from(filterData).forEach(function (listData) {
                item.querySelector(".dropdown-menu-list").innerHTML +=
                  '<li class="dropdown-item d-flex">\
                          <div class="flex-shrink-0 me-2"><img src="' +
                  listData.flagImg +
                  '" alt="country flag" class="options-flagimg" height="20"></div>\
                          <div class="flex-grow-1">\
                          <div class="d-flex"><div class="country-name me-1">' +
                  listData.countryName +
                  '</div><span class="countrylist-codeno text-muted">' +
                  listData.countryCode +
                  "</span></div>\
                          </div>\
                          </li>";
              });
              countryListClickEvent(item);
            }, 350);
          });
        }
      }
    );
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
      <Particles
        id="tsparticles"
        :options="{
          particles: {
            number: {
              value: 90,
              density: {
                enable: true,
                value_area: 800,
              },
            },
            color: {
              value: '#ffffff',
            },
            shape: {
              type: 'circle',
              stroke: {
                width: 0,
                color: '#000000',
              },
              polygon: {
                nb_sides: 5,
              },
              image: {
                src: 'img/github.svg',
                width: 100,
                height: 100,
              },
            },
            opacity: {
              value: 0.8,
              random: true,
              anim: {
                enable: true,
                speed: 1,
                opacity_min: 0,
                sync: false,
              },
            },
            size: {
              value: 4,
              random: true,
              anim: {
                enable: false,
                speed: 4,
                size_min: 0.2,
                sync: false,
              },
            },
            line_linked: {
              enable: false,
              distance: 150,
              color: '#ffffff',
              opacity: 0.4,
              width: 1,
            },
            move: {
              enable: true,
              speed: 2,
              direction: 'none',
              random: false,
              straight: false,
              out_mode: 'out',
              attract: {
                enable: false,
                rotateX: 600,
                rotateY: 1200,
              },
            },
          },
          interactivity: {
            detect_on: 'canvas',
            events: {
              onhover: {
                enable: true,
                mode: 'bubble',
              },
              onclick: {
                enable: true,
                mode: 'repulse',
              },
              resize: true,
            },
            modes: {
              grab: {
                distance: 400,
                line_linked: {
                  opacity: 1,
                },
              },
              bubble: {
                distance: 400,
                size: 4,
                duration: 2,
                opacity: 0.8,
                speed: 3,
              },
              repulse: {
                distance: 200,
              },
              push: {
                particles_nb: 4,
              },
              remove: {
                particles_nb: 2,
              },
            },
          },
          retina_detect: true,
          config_demo: {
            hide_card: false,
            background_color: '#b61924',
            background_image: '',
            background_position: '50% 50%',
            background_repeat: 'no-repeat',
            background_size: 'cover',
          },
        }"
      />
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
                  <h5 class="text-primary">Create New Account</h5>
                </div>
                <div class="p-2 mt-4">
                  <form
                    class="needs-validation"
                    @submit.prevent="tryToRegisterIn"
                    v-if="!isMessageSend"
                  >
                    <b-alert
                      v-model="registerSuccess"
                      class="mt-3"
                      variant="success"
                      dismissible
                      >Registration successfull.</b-alert
                    >

                    <b-alert
                      v-model="isRegisterError"
                      class="mt-3"
                      variant="danger"
                      dismissible
                      >{{ regError }}
                    </b-alert>

                    <div
                      v-if="notification.message"
                      :class="'alert ' + notification.type"
                    >
                      {{ notification.message }}
                    </div>
                    <div class="mb-3">
                      <label for="name" class="form-label"
                        >Name <span class="text-danger">*</span></label
                      >
                      <input
                        type="name"
                        class="form-control"
                        v-model="user.name"
                        id="name"
                        :class="{
                          'is-invalid': isSubmited && v$.user.name.$error,
                        }"
                        placeholder="Enter name"
                      />
                      <div
                        v-for="(item, index) in v$.user.name.$errors"
                        :key="index"
                        class="invalid-feedback"
                      >
                        <span v-if="item.$message">{{ item.$message }}</span>
                      </div>
                    </div>
                    <div class="mb-3">
                      <label for="useremail" class="form-label"
                        >Email <span class="text-danger">*</span></label
                      >
                      <input
                        type="email"
                        class="form-control"
                        v-model="user.email"
                        id="useremail"
                        :class="{
                          'is-invalid': isSubmited && v$.user.email.$error,
                        }"
                        placeholder="Enter email address"
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
                        >Phone<span class="text-danger">*</span></label
                      >
                      <div class="input-group" data-input-flag>
                        <button
                          class="btn btn-light border"
                          type="button"
                          data-bs-toggle="dropdown"
                          aria-expanded="false"
                        >
                          <img
                            src="@/assets/images/flags/in.svg"
                            alt="flag img"
                            height="20"
                            class="country-flagimg rounded"
                          /><span
                            class="ms-2 country-codeno"
                            id="country-codeno-regis"
                            >+ 91</span
                          >
                        </button>
                        <input
                          type="text"
                          class="form-control rounded-end flag-input"
                          v-model="user.phone"
                          placeholder="Enter number"
                          oninput="this.value = this.value.replace(/[^0-9.]/g, '').replace(/(\..*?)\..*/g, '$1');"
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
                        <div class="dropdown-menu w-100">
                          <div class="p-2 px-3 pt-1 searchlist-input">
                            <input
                              type="text"
                              class="
                                form-control form-control-sm
                                border
                                search-countryList
                              "
                              placeholder="Search country name or country code..."
                            />
                          </div>
                          <ul
                            class="list-unstyled dropdown-menu-list mb-0"
                          ></ul>
                        </div>
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
                            'is-invalid': isSubmited && v$.user.password.$error,
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
                              isSubmited && v$.user.confirm_password.$error,
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

                    <div class="mt-4">
                      <button
                        class="
                          btn btn-success
                          w-100
                          align-items-center
                          d-flex
                          justify-content-center
                        "
                        type="submit"
                      >
                        Sign Up
                        <div
                          class="spinner-border loader-setup"
                          role="status"
                          v-if="loader"
                        >
                          <span class="sr-only">Loading...</span>
                        </div>
                      </button>
                    </div>
                  </form>
                  <form
                    class="needs-validation"
                    @submit.prevent="tryToRegisterIn"
                    v-else
                  >
                    <div class="mb-3">
                      <label for="name" class="form-label"
                        >Enter Otp <span class="text-danger">*</span></label
                      >
                      <input
                        type="name"
                        class="form-control"
                        v-model="otp"
                        id="name"
                        :class="{
                          'is-invalid': isSubmited && v$.otp.$error,
                        }"
                        placeholder="Enter Otp"
                      />
                      <div
                        v-for="(item, index) in v$.otp.$errors"
                        :key="index"
                        class="invalid-feedback"
                      >
                        <span v-if="item.$message">{{ item.$message }}</span>
                      </div>
                    </div>

                    <div class="mt-4">
                      <button
                        class="
                          btn btn-success
                          w-100
                          align-items-center
                          d-flex
                          justify-content-center
                        "
                        id="sign-in-button"
                        type="button"
                        @click="verifyOtp"
                        oninput="this.value = this.value.replace(/[^0-9.]/g, '').replace(/(\..*?)\..*/g, '$1');"
                      >
                        Verify Otp
                        <div
                          class="spinner-border loader-setup"
                          role="status"
                          v-if="loader"
                        >
                          <span class="sr-only">Loading...</span>
                        </div>
                      </button>
                    </div>
                  </form>
                </div>
              </div>
              <!-- end card body -->
            </div>
            <!-- end card -->

            <div class="mt-4 text-center">
              <p class="mb-0">
                Already have an account ?
                <router-link
                  to="/login"
                  class="fw-semibold text-primary text-decoration-underline"
                >
                  Signin
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
  <div id="recaptcha-container"></div>
  <!-- end auth-page-wrapper -->
</template>