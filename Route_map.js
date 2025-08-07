 const inputText = document.getElementById("input");
  const outputText = document.getElementById("outputar");
  const translateBtn = document.querySelector(".translate-btn");
  const speakin = document.getElementById("speakin");
  const speakout=document.getElementById("speakout");
  const clear=document.getElementById("clear");

  const languageList = [
  { name: "Afrikaans", code: "af" },
  { name: "Albanian", code: "sq" },
  { name: "Arabic", code: "ar" },
  { name: "Armenian", code: "hy" },
  { name: "Bengali", code: "bn" },
  { name: "Bulgarian", code: "bg" },
  { name: "Catalan", code: "ca" },
  { name: "Chinese (Simplified)", code: "zh" },
  { name: "Chinese (Traditional)", code: "zh-TW" },
  { name: "Croatian", code: "hr" },
  { name: "Czech", code: "cs" },
  { name: "Danish", code: "da" },
  { name: "Dutch", code: "nl" },
  { name: "English", code: "en" },
  { name: "Estonian", code: "et" },
  { name: "Filipino", code: "tl" },
  { name: "Finnish", code: "fi" },
  { name: "French", code: "fr" },
  { name: "Georgian", code: "ka" },
  { name: "German", code: "de" },
  { name: "Greek", code: "el" },
  { name: "Gujarati", code: "gu" },
  { name: "Hebrew", code: "he" },
  { name: "Hindi", code: "hi" },
  { name: "Hungarian", code: "hu" },
  { name: "Icelandic", code: "is" },
  { name: "Indonesian", code: "id" },
  { name: "Italian", code: "it" },
  { name: "Japanese", code: "ja" },
  { name: "Kannada", code: "kn" },
  { name: "Korean", code: "ko" },
  { name: "Latvian", code: "lv" },
  { name: "Lithuanian", code: "lt" },
  { name: "Malay", code: "ms" },
  { name: "Malayalam", code: "ml" },
  { name: "Marathi", code: "mr" },
  { name: "Nepali", code: "ne" },
  { name: "Norwegian", code: "no" },
  { name: "Persian", code: "fa" },
  { name: "Polish", code: "pl" },
  { name: "Portuguese", code: "pt" },
  { name: "Punjabi", code: "pa" },
  { name: "Romanian", code: "ro" },
  { name: "Russian", code: "ru" },
  { name: "Serbian", code: "sr" },
  { name: "Slovak", code: "sk" },
  { name: "Slovenian", code: "sl" },
  { name: "Spanish", code: "es" },
  { name: "Swahili", code: "sw" },
  { name: "Swedish", code: "sv" },
  { name: "Tamil", code: "ta" },
  { name: "Telugu", code: "te" },
  { name: "Thai", code: "th" },
  { name: "Turkish", code: "tr" },
  { name: "Ukrainian", code: "uk" },
  { name: "Urdu", code: "ur" },
  { name: "Vietnamese", code: "vi" },
  { name: "Welsh", code: "cy" }
];

const fromDropdown = document.getElementById("fromLang");
  const toDropdown = document.getElementById("toLang");

  languageList.forEach(lang => {
    const option1 = document.createElement("option");
    option1.value = lang.code;
    option1.textContent = lang.name;
    fromDropdown.appendChild(option1);

    const option2 = document.createElement("option");
    option2.value = lang.code;
    option2.textContent = lang.name;
    toDropdown.appendChild(option2);

  });
  fromDropdown.value = "en"
  toDropdown.value = "hi"


  // Swap Languages
document.querySelector(".swap-btn").addEventListener("click", () => {
  const temp = fromDropdown.value;
  fromDropdown.value = toDropdown.value;
  toDropdown.value = temp;

  
  const tempText = inputText.value;
  inputText.value = outputText.value;
  outputText.value = tempText;
});


clear.addEventListener("click",()=>{
    inputText.value=""
    outputText.value=""
     fromDropdown.value = "en"
  toDropdown.value = "hi"
})


 copyOutput.addEventListener("click", () => {
            if (outputText.value) {
                // Use document.execCommand('copy') as navigator.clipboard.writeText() may not work due to iFrame restrictions.
                const textarea = document.createElement('textarea');
                textarea.value = outputText.value;
                document.body.appendChild(textarea);
                textarea.select();
                try {
                    document.execCommand('copy');
                    
                } catch (err) {
                    console.error('Failed to copy text: ', err);
                    alert("Failed to copy text. Please try again manually.");
                }
                document.body.removeChild(textarea);
            }
        });



speakin.addEventListener("click", () => {
  if ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window) {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.lang = fromDropdown.value || 'en';  

    recognition.onstart = () => {
      inputText.value = "Listening...";
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      inputText.value = transcript;
    };

    recognition.onerror = (event) => {
      inputText.value = 'Error occurred: ' + event.error;
    };

    recognition.start();
  } else {
    alert("Speech recognition not supported in your browser.");
  }
});


 let voices = [];

function populateVoiceList() {
  voices = speechSynthesis.getVoices();
}

populateVoiceList();

// If voices aren't loaded initially, wait for them
if (speechSynthesis.onvoiceschanged !== undefined) {
  speechSynthesis.onvoiceschanged = populateVoiceList;
}

speakout.addEventListener("click", async() => {
  const response = await fetch("https://texttospeech.googleapis.com/v1/text:synthesize?key=AIzaSyAeQf0d8eeHT-8urtIHRQH4c8hVktUe52E", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      input: { text: outputText.value },
      voice: {
        languageCode: `${toLang.value}`,
        name: "hi-IN-Standard-A"
      },
      audioConfig: {
        audioEncoding: "MP3"
      }
    })
  });

  const data = await response.json();
  const audioContent = data.audioContent;

  // Create audio element and play
  const audio = new Audio("data:audio/mp3;base64," + audioContent);
  audio.play();
});




  // Translate Function
  translateBtn.addEventListener("click", async () => {
    const fromLang = fromDropdown.value.toLowerCase();
    const toLang = toDropdown.value.toLowerCase();
    const query = inputText.value;

    const url = `https://free-google-translator.p.rapidapi.com/external-api/free-google-translator?from=${fromLang}&to=${toLang}&query=${encodeURIComponent(query)}`;

    const options = {
      method: 'POST',
      headers: {
        'x-rapidapi-key': 'e877beadc9msh297fea542b4d09fp10cc8ajsn376528f78c77',
        'x-rapidapi-host': 'free-google-translator.p.rapidapi.com',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ translate: 'rapidapi' })
    };

    try {
       
      outputText.value = "Translating...";
      const response = await fetch(url, options);
      const result = await response.json();
      console.log(result.translation)
      outputText.value = result.translation;
      speaks = result.translation;
    } catch (error) {
      outputText.value = "Translation failed.";
      console.error(error);
    }
  });
    
    
    let parent= document.getElementById("parent")
    const currency_btn=document.getElementsByClassName("two")[0]
    const trans_btn=document.getElementsByClassName("one")[0]
    const countryList = {
  AED: "AE",
  AFN: "AF",
  XCD: "AG",
  ALL: "AL",
  AMD: "AM",
  ANG: "AN",
  AOA: "AO",
  AQD: "AQ",
  ARS: "AR",
  AUD: "AU",
  AZN: "AZ",
  BAM: "BA",
  BBD: "BB",
  BDT: "BD",
  XOF: "BE",
  BGN: "BG",
  BHD: "BH",
  BIF: "BI",
  BMD: "BM",
  BND: "BN",
  BOB: "BO",
  BRL: "BR",
  BSD: "BS",
  NOK: "BV",
  BWP: "BW",
  BYR: "BY",
  BZD: "BZ",
  CAD: "CA",
  CDF: "CD",
  XAF: "CF",
  CHF: "CH",
  CLP: "CL",
  CNY: "CN",
  COP: "CO",
  CRC: "CR",
  CUP: "CU",
  CVE: "CV",
  CYP: "CY",
  CZK: "CZ",
  DJF: "DJ",
  DKK: "DK",
  DOP: "DO",
  DZD: "DZ",
  ECS: "EC",
  EEK: "EE",
  EGP: "EG",
  ETB: "ET",
  EUR: "FR",
  FJD: "FJ",
  FKP: "FK",
  GBP: "GB",
  GEL: "GE",
  GGP: "GG",
  GHS: "GH",
  GIP: "GI",
  GMD: "GM",
  GNF: "GN",
  GTQ: "GT",
  GYD: "GY",
  HKD: "HK",
  HNL: "HN",
  HRK: "HR",
  HTG: "HT",
  HUF: "HU",
  IDR: "ID",
  ILS: "IL",
  INR: "IN",
  IQD: "IQ",
  IRR: "IR",
  ISK: "IS",
  JMD: "JM",
  JOD: "JO",
  JPY: "JP",
  KES: "KE",
  KGS: "KG",
  KHR: "KH",
  KMF: "KM",
  KPW: "KP",
  KRW: "KR",
  KWD: "KW",
  KYD: "KY",
  KZT: "KZ",
  LAK: "LA",
  LBP: "LB",
  LKR: "LK",
  LRD: "LR",
  LSL: "LS",
  LTL: "LT",
  LVL: "LV",
  LYD: "LY",
  MAD: "MA",
  MDL: "MD",
  MGA: "MG",
  MKD: "MK",
  MMK: "MM",
  MNT: "MN",
  MOP: "MO",
  MRO: "MR",
  MTL: "MT",
  MUR: "MU",
  MVR: "MV",
  MWK: "MW",
  MXN: "MX",
  MYR: "MY",
  MZN: "MZ",
  NAD: "NA",
  XPF: "NC",
  NGN: "NG",
  NIO: "NI",
  NPR: "NP",
  NZD: "NZ",
  OMR: "OM",
  PAB: "PA",
  PEN: "PE",
  PGK: "PG",
  PHP: "PH",
  PKR: "PK",
  PLN: "PL",
  PYG: "PY",
  QAR: "QA",
  RON: "RO",
  RSD: "RS",
  RUB: "RU",
  RWF: "RW",
  SAR: "SA",
  SBD: "SB",
  SCR: "SC",
  SDG: "SD",
  SEK: "SE",
  SGD: "SG",
  SKK: "SK",
  SLL: "SL",
  SOS: "SO",
  SRD: "SR",
  STD: "ST",
  SVC: "SV",
  SYP: "SY",
  SZL: "SZ",
  THB: "TH",
  TJS: "TJ",
  TMT: "TM",
  TND: "TN",
  TOP: "TO",
  TRY: "TR",
  TTD: "TT",
  TWD: "TW",
  TZS: "TZ",
  UAH: "UA",
  UGX: "UG",
  USD: "US",
  UYU: "UY",
  UZS: "UZ",
  VEF: "VE",
  VND: "VN",
  VUV: "VU",
  YER: "YE",
  ZAR: "ZA",
  ZMK: "ZM",
  ZWD: "ZW",
};


const dropdowns = document.querySelectorAll(".dropdown select");
const btns = document.querySelector("form button");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const msg = document.querySelector(".msg");

for (let select of dropdowns) {
  for (currCode in countryList) {
    let newOption = document.createElement("option");
    newOption.innerText = currCode;
    newOption.value = currCode;
    if (select.name === "from" && currCode === "USD") {
      newOption.selected = "selected";
    } else if (select.name === "to" && currCode === "INR") {
      newOption.selected = "selected";
    }
    select.append(newOption);
  }

  select.addEventListener("change", (evt) => {
    updateFlag(evt.target);
  });
}

const updateExchangeRate = async () => {
  let amount = document.querySelector(".amount input");
  let amtVal = amount.value;
  if (amtVal === "" || amtVal < 1) {
    amtVal = 1;
    amount.value = "1";
  }
  //const URL = ${BASE_URL}/${fromCurr.value.toLowerCase()}/${toCurr.value.toLowerCase()}.json;
  const url=`https://currency-conversion-and-exchange-rates.p.rapidapi.com/convert?from=${fromCurr.value.toLowerCase()}&to=${toCurr.value.toLowerCase()}&amount=${amtVal}`

   const options = {
	method: 'GET',
	headers: {
		'x-rapidapi-key': 'e3d47bc1ddmsh63e3f53ba63218ap1df25fjsncf040ccd6dd7',
		'x-rapidapi-host': 'currency-conversion-and-exchange-rates.p.rapidapi.com'
	}
};

  let response = await fetch(url,options);
  let data = await response.json();
  let rate = (data.info.rate).toFixed(2);

  let finalAmount = amtVal * rate;
  msg.innerText = `${amtVal} ${fromCurr.value} = ${finalAmount} ${toCurr.value}`;
};

const updateFlag = (element) => {
  let currCode = element.value;
  let countryCode = countryList[currCode];
  let newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`;
  let img = element.parentElement.querySelector("img");
  img.src = newSrc;
};

btns.addEventListener("click", (evt) => {
  evt.preventDefault();
  updateExchangeRate();
});

window.addEventListener("load", () => {
  updateExchangeRate();
});
    
    let storedData = localStorage.getItem("final_selected_places");
    console.log(storedData)

     if (storedData) {
    let places = JSON.parse(storedData);
    places.forEach(place => {
        console.log(place.latitude)
        console.log(place.longitude)
        console.log(place.location)
    })
     }

    if (storedData) {
    let places = JSON.parse(storedData); // Converts JSON string → JavaScript array

    // Now you can use `places` as an array
    console.log(places[0].name);

    // Example: Loop and display names
    let z=1;
    places.forEach(place => {

    
        let div= document.createElement("div")
        div.className="planner-item"
        let html=`<img src= "${place.image}" class="planner-item-image" alt="${place.name}">
                    <div>
                        <h3 class="planner-item-title">${place.name}</h3>
                        <p class="planner-item-subtitle">Rating: ${place.rating}</p>
                    </div>
                    <button class="view_details">View Details</button>`
        z++
        div.innerHTML=html
        parent.appendChild(div)            
    });
} else {
    console.log("No data found in localStorage under 'final_selected_places'");
}
    
let originLat = localStorage.getItem("OriginLat");
let originLng = localStorage.getItem("OriginLng");
let destinationLat = localStorage.getItem("DestinationLat");
let destinationLng = localStorage.getItem("DestinationLng");

let btn=document.querySelectorAll(".view_details")

// console.log(originLat,originLng)
// console.log(destinationLat,destinationLng)


var myLatLng = { lat: 38.3460, lng: -0.4907 };

var mapOptions = {
    center: myLatLng,
    zoom: 7,
    mapTypeId: google.maps.MapTypeId.ROADMAP

};

//create map
var map = new google.maps.Map(document.getElementById('googleMap'), mapOptions);

//create a DirectionsService object to use the route method and get a result for our request
var directionsService = new google.maps.DirectionsService();

//create a DirectionsRenderer object which we will use to display the route
var directionsDisplay = new google.maps.DirectionsRenderer();

//bind the DirectionsRenderer to the map

directionsDisplay.setMap(map);
const origin = { lat: parseFloat(originLat), lng: parseFloat(originLng) };       // Example: Mumbai
const destination = { lat: parseFloat(destinationLat), lng: parseFloat(destinationLng) }; // Example: Bengaluru

    // 2. Your JSON data for the waypoints
    const waypointsData = []
    //     places.forEach(place => {
    //         if (place.location && place.location.includes(",")) {
    //   const [lat, lng] = place.location.split(",").map(Number);
      
    //   console.log(`Latitude: ${lat}, Longitude: ${lng}`);
    // } 
    //     })
      if (storedData) {
    let places = JSON.parse(storedData);
    places.forEach(place => {
     const lat = parseFloat(place.latitude);
        const lng = parseFloat(place.longitude);

        if (!isNaN(lat) && !isNaN(lng)) {
            waypointsData.push({ lat: lat, lng: lng });
        }
    })
     }
        // { lat: 18.5204, lng: 73.8567 }, // Pune
        // { lat: 17.3850, lng: 78.4867 },// Hyderabad
        // { lat: 16.9891, lng: 82.2475 } //kakinada


    // 3. Format waypoints for the Google Maps API
    const googleWaypoints = [];
    for (let i = 0; i < waypointsData.length; i++) {
        googleWaypoints.push({
            location: waypointsData[i],
            stopover: true, // 'true' marks this as a stop. 'false' just routes through it.
        });
    }
//define calcRoute function
function calcRoute() {
    //create request
    var request = {
        origin: origin,
        destination: destination,
        waypoints: googleWaypoints, // Add the waypoints array here
        optimizeWaypoints: true,
        // newdestination: newdestination,
        travelMode: google.maps.TravelMode.DRIVING, //WALKING, BYCYCLING, TRANSIT
        unitSystem: google.maps.UnitSystem.IMPERIAL
    }

    //pass the request to the route method
    directionsService.route(request, function (result, status) {
        if (status == google.maps.DirectionsStatus.OK) {

            //Get distance and time
            // const output = document.querySelector('#output');
            // output.innerHTML = "<div class='alert-info'>From: " + document.getElementById("from").value + ".<br />To: " + document.getElementById("to").value + ".<br /> Driving distance <i class='fas fa-road'></i> : " + result.routes[0].legs[0].distance.text + ".<br />Duration <i class='fas fa-hourglass-start'></i> : " + result.routes[0].legs[0].duration.text + ".</div>";

            //display route
            directionsDisplay.setDirections(result);
        } else {
            //delete route from map
            directionsDisplay.setDirections({ routes: [] });
            //center map in London
            map.setCenter(myLatLng);

            //show error message
            output.innerHTML = "<div class='alert-danger'><i class='fas fa-exclamation-triangle'></i> Could not retrieve driving distance.</div>";
        }
    });

}

currency_btn.addEventListener("click",()=>{
    document.getElementsByClassName("container")[0].style="display:block;"
})
document.getElementById("currClose").addEventListener("click",()=>{
    document.getElementsByClassName("container")[0].style="display:none;"
})
trans_btn.addEventListener("click",()=>{
    document.getElementsByClassName("translator-container")[0].style="display:block;"
})
document.getElementById("trans").addEventListener("click",()=>{
    document.getElementsByClassName("translator-container")[0].style="display:none;"
})

btn.forEach((bn,idx)=>{
bn.addEventListener("click",()=>{
    localStorage.setItem(`idx:`,idx)
    window.location.href="NearByPlaces.html"
})
})


window.onload=()=>{
   calcRoute()
}



//create autocomplete objects for all inputs
var options = {
    types: ['(cities)']
}



var input1 = document.getElementById("from");
var autocomplete1 = new google.maps.places.Autocomplete(input1, options);

var input2 = document.getElementById("to");
var autocomplete2 = new google.maps.places.Autocomplete(input2, options);