'use strict'
import React, { Component } from 'react'
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  Button,
  ActivityIndicator,
  Image,
} from 'react-native'
type Props = {};

export default class Detail extends Component<Props>{
  static navigationOptions = {
    title: "Chi Tiết",
  };
    constructor(props){
      super(props);
    }
    tranferdata(data){
      console.log(data);
    }

    render(){
      const {params} = this.props.navigation.state;
      var detail = params.detail;
      var address = detail.location.address;
      var distance = detail.location.distance;
      var name = detail.name;
      //var icon = detail.categories[0].icon.prefix+"36"+detail.categories[0].icon.suffix;
      return(
        <View style={styles.container}>
          <Text style={styles.price}>Tên địa điểm: {name}</Text>
          <Text style={styles.heading}>Địa chỉ: {address}</Text>
          <Text style={styles.distance}>cách bạn {distance} mét</Text>
        </View>
      )
    }
}

const styles = StyleSheet.create({
  container: {
    marginTop: 65
  },
  heading: {
    backgroundColor: '#F8F8F8',
    fontSize: 20,
  },
  separator: {
    height: 1,
    backgroundColor: '#DDDDDD'
  },
  image: {
    width: 400,
    height: 250,
  },
  price: {
    fontSize: 25,
    fontWeight: 'bold',
    margin: 5,
    color: '#48BBEC'
  },
  title: {
    fontSize: 20,
    margin: 5,
    color: '#656565'
  },
  distance:{
    fontSize:30,
    color:"#845732"
  },
  description: {
    fontSize: 18,
    margin: 5,
    color: '#656565'
  }
});
