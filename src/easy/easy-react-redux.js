import React from 'react';
import PropTypes from 'prop-types'
import { bindActionCreators } from './easy-redux'
// connect负责链接组件，给到redux里的数据放到组件的属性里
// 1.负责接收一个组件，把state里的数据放进去，返回一个组件
// 2.数据变化的时候，能够通知组件
// App = connect(
//     state => state,
//     {add}
// )(App)
export const connect = (mapStateToProps = state => state, mapDispathToProps = {}) => (WrapComponent) => { 
    return class connectComponent extends React.Component { 
        static ContextTypes = {
            store:PropTypes.object
        }
        constructor(props,context) {
            super(props);
            this.state = {
                props: {}
            }
        }
        componentDidMount() { 
            const { store } = this.context;
            store.subscribe(() => this.update());
            this.update()
        }
        update() { 
            const { store } = this.store;
            const stateProps = mapStateToProps(store.getState());
            const dispatchProps = bindActionCreators(mapDispathToProps,store.dispatch);
            this.setState({
                props: {
                    ...this.state.props,
                    ...stateProps,
                    ...dispatchProps
                   
                }
            })
        }
        render() { 
            return <WrapComponent {...this.state.props}></WrapComponent>
        }
    }
}


// provider,把stpre放到context里，所有的子元素可以直接获取store

export  class Provider extends React.Component {
    static ContextTypes = {
        store:PropTypes.object
    }

    getChildContext() { 
        return {store:this.store}
    }

    constructor(props, context) {
        super(props, context);
        this.store = props.store;
    }

    render() { 
        return this.props.children
    }
}