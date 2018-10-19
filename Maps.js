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
  ScrollView,
  TouchableOpacity
} from 'react-native'
import { StackNavigator } from "react-navigation";
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
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
function urlForQueryAndPage1(value) {
  const data = {
    key:'AIzaSyBIhGaLJ_2wWY0jeO6GXlq4IunT9oN6-nI',
    input: value,
  };
  const querystring = Object.keys(data).map(key => key + '=' + encodeURIComponent(data[key])).join('&');
  return 'https://maps.googleapis.com/maps/api/place/queryautocomplete/json?' + querystring;
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
      location: [],
    }
    //this.goDetail = this.goDetail.bind(this);
  }

  componentDidMount = () =>  {
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
  _executeQuery1 = (query) =>{
      console.log(query);
    // this.setState({isLoading:true});
    fetch(query)
    .then(response => response.json())
    .then(json => this._handleResponse1(json.status, json.predictions))
    .catch(error =>
      this.setState({
        //isLoading: false,
        message: 'Có gì đó sai sai ' + error
   }));
 };
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
  _handleResponse1 = (status, predictions) => {
    console.log(typeof status);
    console.log(predictions);
    if(status === "OK"){
      this.setState({ location : predictions })
    }
    else {
      console.log("Co loi xay ra");
    }
  };
  _onSearchTextChanged = (event) =>{
    //console.log("_onSearchTextChanged");
    this.setState({searchString: event.nativeEvent.text});
    //console.log("Current: "+this.state.searchString+", Next"+event.nativeEvent.text);
    const query = urlForQueryAndPage1(this.state.searchString);
    this._executeQuery1(query);
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
  _onPress = (item) => {
    console.log(item);
    this.setState({ searchString: item.structured_formatting.main_text})
    console.log(this.state.searchString);
  };
  _goDetail(data){
    this.props.navigation.navigate('Details',{detail:{data}});
  }
  _displayInfo = ()=>{
    const {location, searchString} = this.state;
    // view = [];
    console.log("in ra location "+location);
    if(location.length === 0 || searchString ===''){
      return;
    }
    else {
      view = [];
      location.forEach((item, index) => {
        console.log("item thu "+index+" la "+ item);
        view.push(
          <TouchableOpacity
          key={item.id}
          style={styles.touch}
          onPress={ () => this._onPress(item) }>
            <Text >
              {item.structured_formatting.main_text}
            </Text>
          </TouchableOpacity>
      );
    })
      return view;
    }
  };
  renderMarker = (data) => {
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
      data.forEach((item, index) => {
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
          <MapView.Callout onPress={() => {
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
      >
        {this.renderMarker(this.state.data)}
        </MapView>
      <View style={styles.flowRight}>
      <View style={styles.comtainer1}>
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
      <ScrollView>
            {this._displayInfo()}
      </ScrollView>
      </View>
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
    "width": 250,
    "padding":4,
    "marginBottom":10,
    "flexGrow":1,
    "fontSize":18,
    "borderWidth":1,
    "borderColor":"#48BBEC",
    "borderRadius":30,
    "color":"#48BBEC",
    "backgroundColor":"#fff"
  },
  touch:{
    borderWidth: 1,
    borderRadius: 5,
    width: '100%',
    height: 30,
    backgroundColor: '#fff',
  },
  container1: {
    backgroundColor: '#F5FCFF',
    flex: 1,
    paddingTop: 25
  },
  autocompleteContainer: {
    flex: 1,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
    zIndex: 1
  },
  descriptionContainer: {
    // `backgroundColor` needs to be set otherwise the
    // autocomplete input will disappear on text input.
    backgroundColor: '#F5FCFF',
    marginTop: 25
  },
  itemText: {
    fontSize: 15,
    margin: 2,
  },
  infoText: {
    textAlign: 'center'
  },
  titleText: {
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 10,
    marginTop: 10,
    textAlign: 'center'
  },
  directorText: {
    color: 'grey',
    fontSize: 12,
    marginBottom: 10,
    textAlign: 'center'
  },
  openingText: {
    textAlign: 'center'
  }
})
