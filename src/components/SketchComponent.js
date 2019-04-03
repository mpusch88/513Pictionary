import React, { Component } from 'react';
import  {SketchPad, TOOL_PENCIL, TOOL_LINE, TOOL_RECTANGLE, TOOL_ELLIPSE } from '../../node_modules/react-sketchpad/lib';
import {rcvStrokes} from '../api';
import {sndStrokes} from '../api';

export default class SketchComponent extends Component
{
    socket = null;

    constructor(props) {
        super(props);

        this.state = {
            tool:TOOL_PENCIL,
            size: 2,
            color: '#000000',
            preColor: '#000000',
            fill: false,
            fillColor: '#444444',
            items: []
        };
    }

    componentDidMount() {
        rcvStrokes(item => {
            if(item)this.setState({items: this.state.items.concat([item])});
        });
    }

    render() {
        const { tool, size, color, fill, fillColor, items } = this.state;
        return (
            <div>
                <div style={{float:'top', marginBottom:20}}>
                    <SketchPad
                        width={500}
                        height={500}
                        animate={true}
                        size={size}
                        color={color}
                        fillColor={fill ? fillColor : ''}
                        items={items}
                        tool={tool}
                        onCompleteItem={(i) => sndStrokes(i)}
                        // onCompleteItem={(i) => wsClient.emit('addItem', i)}
                    />
                </div>
                <div style={{float:'left'}}>
                    <div className="tools" style={{marginBottom:20}}>
                        <button
                            style={tool == TOOL_PENCIL ? {fontWeight:'bold'} : undefined}
                            className={tool == TOOL_PENCIL  ? 'item-active' : 'item'}
                            onClick={() => this.setState({tool:TOOL_PENCIL, color: this.state.preColor })}
                        >Pencil</button>
                        <button
                            style={tool == TOOL_LINE ? {fontWeight:'bold'} : undefined}
                            className={tool == TOOL_LINE  ? 'item-active' : 'item'}
                            onClick={() => this.setState({tool:TOOL_LINE, color: this.state.preColor })}
                        >Line</button>
                        <button
                            style={tool == TOOL_ELLIPSE ? {fontWeight:'bold'} : undefined}
                            className={tool == TOOL_ELLIPSE  ? 'item-active' : 'item'}
                            onClick={() => this.setState({tool:TOOL_ELLIPSE, color: this.state.preColor })}
                        >Ellipse</button>
                        <button
                            style={tool == TOOL_RECTANGLE ? {fontWeight:'bold'} : undefined}
                            className={tool == TOOL_RECTANGLE  ? 'item-active' : 'item'}
                            onClick={() => this.setState({tool:TOOL_RECTANGLE, color: this.state.preColor })}
                        >Rectangle</button>
                        {/*<button*/}
                            {/*style={tool == TOOL_ERASER ? {fontWeight:'bold'} : undefined}*/}
                            {/*className={tool == TOOL_ERASER  ? 'item-active' : 'item'}*/}
                            {/*onClick={() => this.setState({tool:TOOL_ERASER, preColor: color, color: 'white' })}*/}
                        {/*>Eraser</button>*/}
                    </div>
                    <div className="options" style={{marginBottom:20}}>
                        <label htmlFor="">size: </label>
                        <input min="1" max="20" type="range" value={size} onChange={(e) => this.setState({size: parseInt(e.target.value) })} />
                    </div>
                    {/*{this.state.tool == TOOL_ERASER ? '' :*/}
                        {/*<div className="options" style={{marginBottom:20}}>*/}
                            {/*<label htmlFor="">color: </label>*/}
                            {/*<input type="color" value={this.state.color} onChange={(e) => this.setState({color: e.target.value, preColor: this.state.color})} />*/}
                        {/*</div>*/}
                    {/*}*/}
                    {(this.state.tool == TOOL_ELLIPSE || this.state.tool == TOOL_RECTANGLE) ?
                        <div>
                            <label htmlFor="">fill in:</label>
                            <input type="checkbox" value={fill} style={{margin:'0 8'}}
                                   onChange={(e) => this.setState({fill: e.target.checked})} />
                            {fill ? <span>
                  <label htmlFor="">with color:</label>
                  <input type="color" value={fillColor} onChange={(e) => this.setState({fillColor: e.target.value})} />
                </span> : ''}
                        </div> : ''}
                </div>
            </div>
        );
    }
}
