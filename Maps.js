import React, { Component } from 'react'
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps'
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  Button,
  ActivityIndicator,
  Image,
} from 'react-native'
import { StackNavigator } from "react-navigation";
type Props = {};
function urlForQueryAndPage(value, lat, long) {
  const data = {
    ll : lat+","+long,
    client_id: 'JWS40E0U0TU2FF4UHROYYHVTJOV04B2BCZEOZDE1KPPDD5EO',
    client_secret: '4WACTNEPVY5AGBCYTFSZIHYCXQ43V53WMUVAJVYL5DLCBRU0',
    radius : '500',
    // limit : '50',
    v : '20181015',
    query: value,
  };
  const querystring = Object.keys(data).map(key => key + '=' + encodeURIComponent(data[key])).join('&');

  return 'https://api.foursquare.com/v2/venues/search?' + querystring;
}
export default class MapTest extends Component {
  static navigationOptions = {
    title: 'Bản đồ',
  };
  constructor(props){
    super(props);
  //  this.navigator.getCurrentPosition
    this.state={
      region:{
        latitude:11.946493,
        longitude: 108.440488,
        latitudeDelta:0.01,
        longitudeDelta:0.01
      },
      error:null,
      searchString:"",
      message:"",
    }
    //this.goDetail = this.goDetail.bind(this);
  }
  componentDidMount() {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        this.setState({
          region:{
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          },
          error: null
        });
      },
      (error) => this.setState({ error: error.message }),
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 },
    );
  }
  _executeQuery = (query) =>{
    console.log(query);
    // this.setState({isLoading:true});
    fetch(query)
    .then(response => response.json())
    .then(json => this._handleResponse(json.meta, json.response.venues))
    .catch(error =>
      this.setState({
        //isLoading: false,
        message: 'Có gì đó sai sai ' + error
   }));
  }
  _handleResponse = (meta, venues) => {
    //this.setState({isLoading:false, message:""});
    // console.log(meta.code);
    // console.log(response.venues);
    if(meta.code === 200 ){
        // console.log(typeof venues);
        // console.log("đã truyền data");
        // console.log(venues);
        this.setState({data : venues});
      //  this._tranferData(this.state.data);
        // console.log(typeof this.state.data);
        // console.log(this.state.marker+" marker hien tai");
        // this.state.data.forEach((item, index)=>{
        //   console.log("Dia diem thu "+index);
        //   console.log(item);
        // })
    }else{
       this.setState({message: "Không xác định được vị trí, thử lại."});
    }
  };
  _onSearchTextChanged = (event) =>{
    //console.log("_onSearchTextChanged");
    this.setState({searchString: event.nativeEvent.text});
    //console.log("Current: "+this.state.searchString+", Next"+event.nativeEvent.text);
  }
  onRegionChangeComplete(data){
    this.setState({
      region:{
        longitudeDelta: data.longitudeDelta,
        latitudeDelta: data.latitudeDelta,
        latitude: data.latitude,
        longitude: data.longitude,
      }
    })
    // const query = urlForQueryAndPage(this.state.searchString,  this.state.region.latitude, this.state.region.longitude);
    // this._executeQuery(query);

    // console.log(this.state.region.longitude + " longtitude hien tai");
    // console.log(this.state.region.latitude + " latitude hien tai");
    // console.log(this.state.searchString +" searchString hien tai");
    //console.log(JSON.parse(this.state.data)+" data hien tai");
  }
  _onSearchPressed = () => {
    const query = urlForQueryAndPage(this.state.searchString,  this.state.region.latitude, this.state.region.longitude);
    this._executeQuery(query);

  };
  onPress(data){
    console.log(data.nativeEvent.coordinate.latitude);
  }
  _goDetail(data){
    this.props.navigation.navigate('Details',{detail:{data}});
  }
  renderMarker(data){
    //console.log(typeof data);
    if(data !== undefined){
      //console.log("chay den day roi ne");
      //console.log(this.state.data);
      markers = [];
      const {navigate} = this.props.navigation;
      markers.push(
        <MapView.Marker
            coordinate={this.state.region}
            title="Tâm bản đồ"
            pinColor={"#e056fd"}
            key={1}
        />
      )
      data.forEach(function(item, index){
        markers.push(
          <MapView.Marker
              coordinate={{
                latitude: item.location.lat,
                longitude: item.location.lng,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01
              }}
              title={item.name}
              moveOnMarkerPress={false}
              description={item.location.address}
              key={item.id}
          >
          <MapView.Callout onPress={function(){
            //console.log("đã nhấn "+JSON.stringify(item));
            navigate("Details", { detail : item });
            //console.log("đã chuyển dữ liệu")
          }}/>
          </MapView.Marker>
        )
      });
      return markers;
    }else{
        console.log("chay den day 1");
        return <MapView.Marker
            coordinate={this.state.region}
            title="Hoàng ở đây"
            pinColor={"#e056fd"}
        />
      }
  }

  render () {
    return (
      <View style={styles.container}>
        <MapView
        provider={PROVIDER_GOOGLE}
        showsUserLocation={true}
        showsCompass = {true}
        style={styles.map}
        region={this.state.region}
        onRegionChangeComplete={this.onRegionChangeComplete.bind(this)}
        // onPress={this.onPress.bind(this)}
      >
        {this.renderMarker(this.state.data)}
        </MapView>
      <View style={styles.flowRight}>
        <TextInput
          style={styles.searchInput}
          value={this.state.searchString}
          onChange={this._onSearchTextChanged}
          underlineColorAndroid={'transparent'}
          placeholder='Search'/>
        <Button
          onPress={this._onSearchPressed}
          color='#48BBEC'
          title="Tìm"
          />
        </View>
      </View>
    )
  }
}
const styles = StyleSheet.create({
  container: { ... StyleSheet.absoluteFillObject },
  map: { ...StyleSheet.absoluteFillObject },
  flowRight:{
    //"borderColor": "blue",
    // "paddingBottom": 10,
    "flexDirection":"row",
    "alignItems":"center",
    "alignSelf":"stretch"
  },
  searchInput:{
    "height":36,
    //"width":1,
    "padding":4,
    "marginBottom":10,
    "flexGrow":1,
    "fontSize":18,
    "borderWidth":1,
    "borderColor":"#48BBEC",
    "borderRadius":30,
    "color":"#48BBEC",
    "backgroundColor":"#fff"
  }
})
