import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import Accordion from 'react-bootstrap/Accordion';
import Button from 'react-bootstrap/Button';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faTrash, faPen, faHandPaper } from '@fortawesome/free-solid-svg-icons'

import { resetWhiteboard, addEditor, setCanvasDrawable, setDragnDropButtonActive } from '../actions'

class Controls extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isExpanded: null,
      penButtonActive: false,
      dragnDropButtonActive: false
    };

    this.handleExpandClick = this.handleExpandClick.bind(this);
  }

  handleExpandClick = () => {
    if (this.state.isExpanded === null) {
      this.setState({
      isExpanded: true
    });
    } else if (this.state.isExpanded === true || this.state.isExpanded === false) {
      this.setState(state => ({
      isExpanded: !state.isExpanded
    }));
    }
  }

  handlePenButton = () => {
    this.setState({
      penButtonActive: !this.state.penButtonActive,
      dragnDropButtonActive: false
    }, () => {
      if (this.state.penButtonActive) {
        this.props.setCanvasDrawable(true)
        this.props.setDragnDropButtonActive(false)
      } else if (!this.state.penButtonActive) {
        this.props.setCanvasDrawable(false)
      }
    })
  }

  handleDragnDropButton = () => {
    this.setState({
      dragnDropButtonActive: !this.state.dragnDropButtonActive,
      penButtonActive: false
    }, () => {
      if (this.state.dragnDropButtonActive) {
        this.props.setDragnDropButtonActive(true)
        this.props.setCanvasDrawable(false)
        document.documentElement.style.cursor = "grab";
      } else if (!this.state.dragnDropButtonActive) {
        this.props.setDragnDropButtonActive(false)
        document.documentElement.style.cursor = "default";
      }
    })
  }

  handleDeleteButton = () => {
    const confirmation = window.confirm("Are you sure you want to delete? This can't be undone");
    if ( confirmation === true ) {
      // this.props.resetWhiteboard(true)
      const confirmationPathAndKey = this.props.path +'/confirmclear'
      this.props.addEditor({[confirmationPathAndKey]: true})
    }
  }

  render() {
    const expandStyle = {
      border: '3px solid #0599F7',
      borderRadius: '50%',
      width: '60px',
      height: '60px',
      backgroundColor: 'white',
      color: '#0599F7',
      marginBottom: '20px',
      textAlign: 'center'
    }

    let toggleClass = ""
    let togglerText = "Show tools"
    let penClass = "tools"
    let dragnDropClass = "tools"

    if (this.state.isExpanded === true){
      toggleClass = "toolsExpand"
      togglerText = "Hide tools"
    } else if (this.state.isExpanded === false) {
      toggleClass = "toolsContract"
      togglerText = "Show tools"
    }

    if (this.props.canvasDrawable) {
      penClass += " penButtonActive"
    }

    console.log(this.props.dragnDropButtonActive, "button active")
    if (this.props.dragnDropButtonActive) {
      dragnDropClass += " dragnDropButtonActive"
    }


    return (
      <div>
        <Accordion>
          <div style={{position: "fixed", bottom: "0", zIndex: "1"}}>
            <OverlayTrigger
                  placement={"right"}
                  overlay={
                    <Tooltip id={`tooltip-pen`}>
                      <strong>{togglerText}</strong>
                    </Tooltip>
                  }
                >
              <Accordion.Toggle as={Button} onClick={this.handleExpandClick} style={expandStyle} className={toggleClass} variant="link" eventKey="0">

                <FontAwesomeIcon icon={faPlus} size="2x"/>

              </Accordion.Toggle>
            </OverlayTrigger>
          </div>
          <Accordion.Collapse eventKey="0">
            <div style={{display: 'flex', flexDirection: 'column', width: '60px'}}>
              <OverlayTrigger
                  placement={"right"}
                  overlay={
                    <Tooltip id={`tooltip-pen`}>
                      <strong>Draw tool</strong><br/><small><i>Shortcut: hold 'alt' and draw with mouse</i></small>
                    </Tooltip>
                  }
                >
                <button className={penClass} id={"penButton"} onClick={this.handlePenButton} ><FontAwesomeIcon icon={faPen} size="1x"/></button>
              </OverlayTrigger>

              <OverlayTrigger
                  placement={"right"}
                  overlay={
                    <Tooltip id={`tooltip-hand`}>
                      <strong>Grab n Drag tool</strong><br/><small><i>Shortcut: hold 'cmd' and click an item then drag with mouse</i></small>
                    </Tooltip>
                  }
                >
                <button className={dragnDropClass} id={"dragnDropButton"} onClick={this.handleDragnDropButton} ><FontAwesomeIcon icon={faHandPaper} size="1x"/></button>
              </OverlayTrigger>

              <OverlayTrigger
                  placement={"right"}
                  overlay={
                    <Tooltip id={`tooltip-delete`}>
                      <strong>Clear whiteboard</strong><br/><small><i>Start from scratch</i></small>
                    </Tooltip>
                  }
                >
                <button className={"tools finalTool"} id={"clearWhiteboardButton"} onClick={this.handleDeleteButton}><FontAwesomeIcon icon={faTrash} size="1x"/></button>
              </OverlayTrigger>
            </div>
          </Accordion.Collapse>
        </Accordion>
      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators( {
    resetWhiteboard: resetWhiteboard,
    addEditor: addEditor,
    setCanvasDrawable: setCanvasDrawable,
    setDragnDropButtonActive: setDragnDropButtonActive
  },
    dispatch
  );
}

function mapReduxStateToProps(reduxState) {
  return {
    canvasDrawable: reduxState.canvasDrawable,
    dragnDropButtonActive: reduxState.dragnDropButtonActive
  }
}

export default connect(mapReduxStateToProps, mapDispatchToProps)(Controls);
