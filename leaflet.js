//create map ,see whole 
const Greece=new L.LatLng(39.07,21.82)
const map=L.map('map').setView(Greece,6);
//set tiles
const tileUrl='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
const attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
let tiles = L.tileLayer(tileUrl, {attribution}).addTo(map);
tiles.addTo(map);

//set icon
const vesselsIcon = L.icon({
    iconUrl: 'SVG_boat.svg',
    iconSize: [30, 30],
    iconAnchor: [15,15],
    popupAnchor:[0,-5]
});
//create object to store all vessels
const vessels=[];
//init websocket connection
setWebSocket();
//decide whether to store new vessel or redraw one
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
        vesselOnMap: L.marker([point.x,point.y],{icon:vesselsIcon}).bindPopup(`<p>${data.name}</p>`).addTo(map)
    };
    vessels.push(vessel);
    vessel.cords.push(point);
}
function redrawVessel(data){
    let knownVessel=vessels.find(v=>v.id==data.id);
    let point=L.point([data.lat,data.lon]);
    knownVessel.cords.push(point);
    map.removeLayer(knownVessel.vesselOnMap);
    let latlon = createLatLong(knownVessel.cords)
    L.polyline(latlon,
        {
            color:'#3388ff',
            weight:2,
            opacity:1,
            radius:1000
        }
        ).addTo(map);
    knownVessel.vesselOnMap=L.marker([knownVessel.cords[knownVessel.cords.length-1].x,knownVessel.cords[knownVessel.cords.length-1].y],
            {icon:vesselsIcon} 
        ).bindPopup(`<p>${knownVessel.name}</p>`).addTo(map)

}

//create array for L.polyline LatLon argument 
function createLatLong(data){
    let array=[];
    for(let i=0;i<data.length;i++){
        array.push(Object.values(data[i]))
    }
    return array;
}

function updateTimestamp(data){
    // Create date based object from data.timestamp
    // multiplied by 1000 so that the arg is in milliseconds, not seconds.
    document.getElementById("time").innerHTML=`${(new Date(data.timestamp*1000)).toUTCString()}`
}