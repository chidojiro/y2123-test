import ldIsFunction from 'lodash/isFunction'
import ldIsArray from 'lodash/isArray'
import React from 'react'

const isRef = <T = Element>(target: any): target is React.RefObject<T> => target?.hasOwnProperty('current')

const isArray = ldIsArray

const isFunction = ldIsFunction

const AssertUtils = { isRef, isArray, isFunction }

export default AssertUtils
