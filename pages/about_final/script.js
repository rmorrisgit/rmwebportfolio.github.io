let countriesData;
let selectedCountryData;
const worldPopulation = 8100000000;

document.addEventListener('DOMContentLoaded', () => {
    // Fetch countries data and populate dropdown
    readTextFile("countries.json");

    // Event listener for country selection
    document.getElementById('countryNameList').addEventListener('change', displayCountryInfo);
    document.getElementById('sqm').addEventListener('change', convertArea);
    document.getElementById('sqkm').addEventListener('change', convertArea);
    document.getElementById('per-sqm').addEventListener('change', convertDensity);
    document.getElementById('per-sqkm').addEventListener('change', convertDensity);

});

function  parseCountryJSON(responseRaw) {
  var countryHtml = `<option value="none">Select a country</option>`;
  countriesData = JSON.parse(responseRaw);

  for (let i=0; i< countriesData.length; i++)
  {
    countryHtml = `${countryHtml} \n <option value = "${countriesData[i].Name}" id="${countriesData[i].Name}">${countriesData[i].Name}</option>`;
  }  
    //insert the country to the dropdown
  document.getElementById("countryNameList").innerHTML = countryHtml;
}

function readTextFile(file) {
    var rawFile = new XMLHttpRequest();
    rawFile.overrideMimeType("application/json");
    rawFile.open("GET", file, true);
    rawFile.onreadystatechange = function() {
        if (rawFile.readyState === 4 && rawFile.status == "200") {
            parseCountryJSON(rawFile.responseText);
        }
    }
    rawFile.send(null);
}

// Display country information
function displayCountryInfo() {
    if (this.value == "none") {
        // no country selected
        return;
    }
    // reset to default miles
    document.getElementById('sqm').checked = true;
    document.getElementById('sqkm').checked = false;
    document.getElementById('per-sqm').checked = true;
    document.getElementById('per-sqkm').checked = false;



    const selectedCountryName = this.value;
    document.getElementById('selectedCountry').textContent = selectedCountryName;

    // replace spaces with underscores in country name
    const flagCountryName = selectedCountryName.split(' ').join('_');
    // Fetch and display flag based on the selected country
    const flagImage = document.getElementById('flagImage');
    flagImage.src = `flags/${flagCountryName}.png`; 

    var dataColumn = document.getElementById('dataColumn');
    dataColumn.style = "display:block;"

    for (let i=0; i < countriesData.length; i++) {
        if (selectedCountryName == countriesData[i].Name) {
            document.getElementById('population').textContent = `Population: ${countriesData[i].Population}`;
            document.getElementById('area').textContent = `Area: ${countriesData[i].Area} squared miles`;
            document.getElementById("wikiLink").href = `https://en.wikipedia.org/wiki/${flagCountryName}`;
            document.getElementById('worldpopulation-percentage-result').textContent = `${(countriesData[i].Population / worldPopulation * 100).toFixed(5)} %`;
            document.getElementById('population-density-result').textContent = `${(countriesData[i].Population / countriesData[i].Area).toFixed(5)} people per squared mile`
          
            selectedCountryData = countriesData[i];
        }
    }
}

function convertArea() {
    const selectedValue = this.value;
    console.log(selectedValue);
    console.log(selectedCountryData);

    if (selectedValue == "sqm") {
        document.getElementById('area').textContent = `Area: ${selectedCountryData.Area} squared miles`;
    } else {
        document.getElementById('area').textContent = `Area: ${(selectedCountryData.Area * 2.58).toFixed(5)} squared km`;
    }
}

function convertDensity() {
    const selectedValue = this.value;

    if (selectedValue == "per-sqm") {
        document.getElementById('population-density-result').textContent = `${(selectedCountryData.Population / selectedCountryData.Area).toFixed(5)} people per squared mile`
    } else {
        document.getElementById('population-density-result').textContent = `${(selectedCountryData.Population / (selectedCountryData.Area * 2.58)).toFixed(5)} people per squared km`
    }
}
