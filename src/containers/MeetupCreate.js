import React from 'react';
import SemanticDatepicker from 'react-semantic-ui-datepickers';
import 'react-semantic-ui-datepickers/dist/react-semantic-ui-datepickers.css';
import "react-datepicker/dist/react-datepicker.css";
import { Dropdown, Select, Button } from 'semantic-ui-react'
import { TimeInput } from 'semantic-ui-calendar-react' 
import YelpSearch from '../components/yelpsearch'
import MapCreate from '../components/MapCreate'
import { ReactComponent as Calendar } from '../icons/calendar.svg'
import { ReactComponent as Location } from '../icons/location.svg'
import { ReactComponent as Time } from '../icons/time.svg'
import { Redirect } from "react-router-dom";

class MeetupCreate extends React.Component {

  getTime = () => {
    let date = new Date()
    let minute = date.getMinutes()
    if(minute < 10){
      minute = "0" + minute
    }
    let meridiem = "AM"
    let hour = date.getHours()
    if(hour > 12){
      hour -= 12
      meridiem = "PM"
    } 
    hour += 1
    return `${hour}:${minute} ${meridiem}`
  }

  state = {
    dateSelected: undefined,
    timeSelected: this.getTime(),
    restaurantSelected: [],
    startDate: new Date(new Date().setDate(new Date().getDate()-1)),
    results: []
  }

  onChangeCalendar = (e,data) =>{
    this.setState({
      dateSelected: data.value
    })
  }

  onChangeTime = (e, {name, value}) =>{
    this.setState({
      timeSelected: value
    })
  }

  onChangeLocation = (e,value) =>{
    this.setState({
      restaurantSelected: [value.value]
    })
  }

  onChangeResults = (locations) =>{
    this.setState({
      results: locations.businesses
    })
  }

  restaurantLocations = () =>{
   let x =  this.state.results.map(restaurants =>{
      return {key: restaurants.id, value: restaurants, text: restaurants.name}
    })
    return x
  }

  submitMeetup = (e) =>{
    e.preventDefault()
    let user = this.props.user
    let {dateSelected, restaurantSelected, timeSelected} = this.state 
    let friendsInvited = this.props.friendsInvited

    let data ={
      user,
      dateSelected,
      restaurantSelected,
      friendsInvited,
      timeSelected
    }

    fetch(`http://localhost:3000/meetups`,{
      method: 'POST', 
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    })
    .then(obj => obj.json())
    .then(obj => {
      this.props.handleNewMeetups(obj)
      this.props.history.push("/home")
    })

  }

  render() {
    
    console.log(this.props.friendsLocation)
    const friendOptions = this.props.friends.map(friend => {
      return { key: `${friend.id}`, text: `${friend.first_name}`, value: friend }
    })
    
    return (
      <section className="create-section">
        <h2 className="create-header">Create Hangout</h2>

        <div className="create-container">
        {this.props.user === "pending"? <Redirect to="/register" />:null}
          <form className="create-form">
            <YelpSearch  lat={this.props.friendsLat} lng={this.props.friendsLng} results = {this.onChangeResults}/>

            <div className="create-hangout">
              <h2>Set it up!</h2>
              <div className="hangout-div">
                <Calendar /><SemanticDatepicker minDate={this.state.startDate} onChange={this.onChangeCalendar}/>
              </div>
              <div className="hangout-time">
                <Time /><TimeInput name="time" popupPosition="bottom left" timeFormat="ampm"closable={true} onChange={this.onChangeTime} value={this.state.timeSelected}/>
              </div>
              <div className="hangout-div">
                {/* should get location by address. should be auto populated? */}
                <Location /><Select placeholder='Select the location' options={this.restaurantLocations()} onChange={this.onChangeLocation} />
                {/* <Dropdown placeholder='Select a location' search selection options={this.restaurantLocations()} /> */}
              </div>
              <div className="hangout-friends">
                <label className="hangout">Invited:</label>
                <Dropdown placeholder='Select Friends' fluid multiple selection options={friendOptions} onChange={this.props.invite}
                value = {this.props.friendsInvited}
                />
                {/* <Button>Recalculate Locations</Button> */}
              </div>
              <Button onClick={this.submitMeetup}>Create Hangout</Button>
            </div>
          </form>
  
            <div className="create-map">
              <MapCreate friends={this.props.friendsLocation} friendsInvited={this.props.friendsInvited} restaurants={this.state.results} lat={this.props.lat} lng={this.props.lng}/>
            </div>
          </div>
        </section>
      );
    }
  }
  

export default MeetupCreate;


