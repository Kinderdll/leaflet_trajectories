//create map ,see whole 
const Greece=new L.LatLng(39.07,21.82)
const map=L.map('map').setView(Greece,6);
const vessels=[];
//set tiles
const tileUrl='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
const attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
let tiles = L.tileLayer(tileUrl, {attribution}).addTo(map);
tiles.addTo(map);

//set icon
const vesselsIcon = L.icon({
    iconUrl: 'SVG_boat.svg',
    iconSize: [5, 5],
    iconAnchor: [3,3],
});
//L.marker([39.07,21.82],{icon:vesselsIcon}).addTo(map)
setWebSocket();
function processData(data){
    let vessel=vessels.find(v=>v.id==data.id);
    if(!vessel){
       addNewVessel(data)
    }
    else{
        redrawVessel(data);
    }
    updateTimestamp(data);  
}

function addNewVessel(data){
    let point=L.point([data.lat,data.lon]);
    let vessel={
        id:data.id,
        name:data.name,
        cords:[],
        vesselOnMap: L.circle([point.x,point.y],
            {
                color:'#3388ff',
                weight:3,
                opacity:1,
                radius:1000
            } 
        ).addTo(map)
    };
    vessels.push(vessel);
    vessel.cords.push(point);
}
function redrawVessel(data){
    let knownVessel=vessels.find(v=>v.id==data.id);
    let point=L.point([data.lat,data.lon]);
    //let didMove= didVesselMove(knownVessel,point);
    //if(didMove){
    knownVessel.cords.push(point);
    map.removeLayer(knownVessel.vesselOnMap);
    let latlon = createLatLong(knownVessel.cords)
    L.polyline(latlon,
        {
            color:'#3388ff',
            weight:3,
            opacity:1,
            radius:1000
        }
        ).addTo(map);
    knownVessel.vesselOnMap=L.circle([knownVessel.cords[knownVessel.cords.length-1].x,knownVessel.cords[knownVessel.cords.length-1].y],
            {
                color:'#3388ff',
                weight:1,
                opacity:1,
                radius:1000
            } 
        ).addTo(map)
    }

function createLatLong(data){
    let array=[];
    for(let i=0;i<data.length;i++){
        array.push(Object.values(data[i]))
    }
    return array;
}
function updateTimestamp(data){
    // Create a new JavaScript Date object based on the timestamp
    // multiplied by 1000 so that the argument is in milliseconds, not seconds.
    document.getElementById("time").innerHTML=`${(new Date(data.timestamp*1000)).toUTCString()}`
}