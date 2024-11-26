import{d as G,V as M,M as L,T as A,Q as N,e as I,f as T,R as B,h as V,i as Q,a as j,B as $,j as z,k as J,l as tt,m as S,n as et,g as d,S as it,D as W,G as U,c as st,A as ot,b as nt,P as H,W as Z,L as K,o as at,C as F}from"./SkeletonUtils-C7gMkyqH.js";import{S as rt}from"./ScrollTrigger-DZdR0iV_.js";const Y={type:"change"},k={type:"start"},X={type:"end"},O=new B,q=new V,ht=Math.cos(70*Q.DEG2RAD),_=new M,w=2*Math.PI,c={NONE:-1,ROTATE:0,DOLLY:1,PAN:2,TOUCH_ROTATE:3,TOUCH_PAN:4,TOUCH_DOLLY_PAN:5,TOUCH_DOLLY_ROTATE:6},C=1e-6;class lt extends G{constructor(t,e=null){super(t,e),this.state=c.NONE,this.enabled=!0,this.target=new M,this.cursor=new M,this.minDistance=0,this.maxDistance=1/0,this.minZoom=0,this.maxZoom=1/0,this.minTargetRadius=0,this.maxTargetRadius=1/0,this.minPolarAngle=0,this.maxPolarAngle=Math.PI,this.minAzimuthAngle=-1/0,this.maxAzimuthAngle=1/0,this.enableDamping=!1,this.dampingFactor=.05,this.enableZoom=!0,this.zoomSpeed=1,this.enableRotate=!0,this.rotateSpeed=1,this.enablePan=!0,this.panSpeed=1,this.screenSpacePanning=!0,this.keyPanSpeed=7,this.zoomToCursor=!1,this.autoRotate=!1,this.autoRotateSpeed=2,this.keys={LEFT:"ArrowLeft",UP:"ArrowUp",RIGHT:"ArrowRight",BOTTOM:"ArrowDown"},this.mouseButtons={LEFT:L.ROTATE,MIDDLE:L.DOLLY,RIGHT:L.PAN},this.touches={ONE:A.ROTATE,TWO:A.DOLLY_PAN},this.target0=this.target.clone(),this.position0=this.object.position.clone(),this.zoom0=this.object.zoom,this._domElementKeyEvents=null,this._lastPosition=new M,this._lastQuaternion=new N,this._lastTargetPosition=new M,this._quat=new N().setFromUnitVectors(t.up,new M(0,1,0)),this._quatInverse=this._quat.clone().invert(),this._spherical=new I,this._sphericalDelta=new I,this._scale=1,this._panOffset=new M,this._rotateStart=new T,this._rotateEnd=new T,this._rotateDelta=new T,this._panStart=new T,this._panEnd=new T,this._panDelta=new T,this._dollyStart=new T,this._dollyEnd=new T,this._dollyDelta=new T,this._dollyDirection=new M,this._mouse=new T,this._performCursorZoom=!1,this._pointers=[],this._pointerPositions={},this._controlActive=!1,this._onPointerMove=dt.bind(this),this._onPointerDown=ct.bind(this),this._onPointerUp=pt.bind(this),this._onContextMenu=wt.bind(this),this._onMouseWheel=_t.bind(this),this._onKeyDown=ft.bind(this),this._onTouchStart=yt.bind(this),this._onTouchMove=gt.bind(this),this._onMouseDown=ut.bind(this),this._onMouseMove=mt.bind(this),this._interceptControlDown=bt.bind(this),this._interceptControlUp=Pt.bind(this),this.domElement!==null&&this.connect(),this.update()}connect(){this.domElement.addEventListener("pointerdown",this._onPointerDown),this.domElement.addEventListener("pointercancel",this._onPointerUp),this.domElement.addEventListener("contextmenu",this._onContextMenu),this.domElement.addEventListener("wheel",this._onMouseWheel,{passive:!1}),this.domElement.getRootNode().addEventListener("keydown",this._interceptControlDown,{passive:!0,capture:!0}),this.domElement.style.touchAction="none"}disconnect(){this.domElement.removeEventListener("pointerdown",this._onPointerDown),this.domElement.removeEventListener("pointermove",this._onPointerMove),this.domElement.removeEventListener("pointerup",this._onPointerUp),this.domElement.removeEventListener("pointercancel",this._onPointerUp),this.domElement.removeEventListener("wheel",this._onMouseWheel),this.domElement.removeEventListener("contextmenu",this._onContextMenu),this.stopListenToKeyEvents(),this.domElement.getRootNode().removeEventListener("keydown",this._interceptControlDown,{capture:!0}),this.domElement.style.touchAction="auto"}dispose(){this.disconnect()}getPolarAngle(){return this._spherical.phi}getAzimuthalAngle(){return this._spherical.theta}getDistance(){return this.object.position.distanceTo(this.target)}listenToKeyEvents(t){t.addEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=t}stopListenToKeyEvents(){this._domElementKeyEvents!==null&&(this._domElementKeyEvents.removeEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=null)}saveState(){this.target0.copy(this.target),this.position0.copy(this.object.position),this.zoom0=this.object.zoom}reset(){this.target.copy(this.target0),this.object.position.copy(this.position0),this.object.zoom=this.zoom0,this.object.updateProjectionMatrix(),this.dispatchEvent(Y),this.update(),this.state=c.NONE}update(t=null){const e=this.object.position;_.copy(e).sub(this.target),_.applyQuaternion(this._quat),this._spherical.setFromVector3(_),this.autoRotate&&this.state===c.NONE&&this._rotateLeft(this._getAutoRotationAngle(t)),this.enableDamping?(this._spherical.theta+=this._sphericalDelta.theta*this.dampingFactor,this._spherical.phi+=this._sphericalDelta.phi*this.dampingFactor):(this._spherical.theta+=this._sphericalDelta.theta,this._spherical.phi+=this._sphericalDelta.phi);let i=this.minAzimuthAngle,o=this.maxAzimuthAngle;isFinite(i)&&isFinite(o)&&(i<-Math.PI?i+=w:i>Math.PI&&(i-=w),o<-Math.PI?o+=w:o>Math.PI&&(o-=w),i<=o?this._spherical.theta=Math.max(i,Math.min(o,this._spherical.theta)):this._spherical.theta=this._spherical.theta>(i+o)/2?Math.max(i,this._spherical.theta):Math.min(o,this._spherical.theta)),this._spherical.phi=Math.max(this.minPolarAngle,Math.min(this.maxPolarAngle,this._spherical.phi)),this._spherical.makeSafe(),this.enableDamping===!0?this.target.addScaledVector(this._panOffset,this.dampingFactor):this.target.add(this._panOffset),this.target.sub(this.cursor),this.target.clampLength(this.minTargetRadius,this.maxTargetRadius),this.target.add(this.cursor);let n=!1;if(this.zoomToCursor&&this._performCursorZoom||this.object.isOrthographicCamera)this._spherical.radius=this._clampDistance(this._spherical.radius);else{const a=this._spherical.radius;this._spherical.radius=this._clampDistance(this._spherical.radius*this._scale),n=a!=this._spherical.radius}if(_.setFromSpherical(this._spherical),_.applyQuaternion(this._quatInverse),e.copy(this.target).add(_),this.object.lookAt(this.target),this.enableDamping===!0?(this._sphericalDelta.theta*=1-this.dampingFactor,this._sphericalDelta.phi*=1-this.dampingFactor,this._panOffset.multiplyScalar(1-this.dampingFactor)):(this._sphericalDelta.set(0,0,0),this._panOffset.set(0,0,0)),this.zoomToCursor&&this._performCursorZoom){let a=null;if(this.object.isPerspectiveCamera){const r=_.length();a=this._clampDistance(r*this._scale);const h=r-a;this.object.position.addScaledVector(this._dollyDirection,h),this.object.updateMatrixWorld(),n=!!h}else if(this.object.isOrthographicCamera){const r=new M(this._mouse.x,this._mouse.y,0);r.unproject(this.object);const h=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),this.object.updateProjectionMatrix(),n=h!==this.object.zoom;const l=new M(this._mouse.x,this._mouse.y,0);l.unproject(this.object),this.object.position.sub(l).add(r),this.object.updateMatrixWorld(),a=_.length()}else console.warn("WARNING: OrbitControls.js encountered an unknown camera type - zoom to cursor disabled."),this.zoomToCursor=!1;a!==null&&(this.screenSpacePanning?this.target.set(0,0,-1).transformDirection(this.object.matrix).multiplyScalar(a).add(this.object.position):(O.origin.copy(this.object.position),O.direction.set(0,0,-1).transformDirection(this.object.matrix),Math.abs(this.object.up.dot(O.direction))<ht?this.object.lookAt(this.target):(q.setFromNormalAndCoplanarPoint(this.object.up,this.target),O.intersectPlane(q,this.target))))}else if(this.object.isOrthographicCamera){const a=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),a!==this.object.zoom&&(this.object.updateProjectionMatrix(),n=!0)}return this._scale=1,this._performCursorZoom=!1,n||this._lastPosition.distanceToSquared(this.object.position)>C||8*(1-this._lastQuaternion.dot(this.object.quaternion))>C||this._lastTargetPosition.distanceToSquared(this.target)>C?(this.dispatchEvent(Y),this._lastPosition.copy(this.object.position),this._lastQuaternion.copy(this.object.quaternion),this._lastTargetPosition.copy(this.target),!0):!1}_getAutoRotationAngle(t){return t!==null?w/60*this.autoRotateSpeed*t:w/60/60*this.autoRotateSpeed}_getZoomScale(t){const e=Math.abs(t*.01);return Math.pow(.95,this.zoomSpeed*e)}_rotateLeft(t){this._sphericalDelta.theta-=t}_rotateUp(t){this._sphericalDelta.phi-=t}_panLeft(t,e){_.setFromMatrixColumn(e,0),_.multiplyScalar(-t),this._panOffset.add(_)}_panUp(t,e){this.screenSpacePanning===!0?_.setFromMatrixColumn(e,1):(_.setFromMatrixColumn(e,0),_.crossVectors(this.object.up,_)),_.multiplyScalar(t),this._panOffset.add(_)}_pan(t,e){const i=this.domElement;if(this.object.isPerspectiveCamera){const o=this.object.position;_.copy(o).sub(this.target);let n=_.length();n*=Math.tan(this.object.fov/2*Math.PI/180),this._panLeft(2*t*n/i.clientHeight,this.object.matrix),this._panUp(2*e*n/i.clientHeight,this.object.matrix)}else this.object.isOrthographicCamera?(this._panLeft(t*(this.object.right-this.object.left)/this.object.zoom/i.clientWidth,this.object.matrix),this._panUp(e*(this.object.top-this.object.bottom)/this.object.zoom/i.clientHeight,this.object.matrix)):(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - pan disabled."),this.enablePan=!1)}_dollyOut(t){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale/=t:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_dollyIn(t){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale*=t:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_updateZoomParameters(t,e){if(!this.zoomToCursor)return;this._performCursorZoom=!0;const i=this.domElement.getBoundingClientRect(),o=t-i.left,n=e-i.top,a=i.width,r=i.height;this._mouse.x=o/a*2-1,this._mouse.y=-(n/r)*2+1,this._dollyDirection.set(this._mouse.x,this._mouse.y,1).unproject(this.object).sub(this.object.position).normalize()}_clampDistance(t){return Math.max(this.minDistance,Math.min(this.maxDistance,t))}_handleMouseDownRotate(t){this._rotateStart.set(t.clientX,t.clientY)}_handleMouseDownDolly(t){this._updateZoomParameters(t.clientX,t.clientX),this._dollyStart.set(t.clientX,t.clientY)}_handleMouseDownPan(t){this._panStart.set(t.clientX,t.clientY)}_handleMouseMoveRotate(t){this._rotateEnd.set(t.clientX,t.clientY),this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);const e=this.domElement;this._rotateLeft(w*this._rotateDelta.x/e.clientHeight),this._rotateUp(w*this._rotateDelta.y/e.clientHeight),this._rotateStart.copy(this._rotateEnd),this.update()}_handleMouseMoveDolly(t){this._dollyEnd.set(t.clientX,t.clientY),this._dollyDelta.subVectors(this._dollyEnd,this._dollyStart),this._dollyDelta.y>0?this._dollyOut(this._getZoomScale(this._dollyDelta.y)):this._dollyDelta.y<0&&this._dollyIn(this._getZoomScale(this._dollyDelta.y)),this._dollyStart.copy(this._dollyEnd),this.update()}_handleMouseMovePan(t){this._panEnd.set(t.clientX,t.clientY),this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd),this.update()}_handleMouseWheel(t){this._updateZoomParameters(t.clientX,t.clientY),t.deltaY<0?this._dollyIn(this._getZoomScale(t.deltaY)):t.deltaY>0&&this._dollyOut(this._getZoomScale(t.deltaY)),this.update()}_handleKeyDown(t){let e=!1;switch(t.code){case this.keys.UP:t.ctrlKey||t.metaKey||t.shiftKey?this._rotateUp(w*this.rotateSpeed/this.domElement.clientHeight):this._pan(0,this.keyPanSpeed),e=!0;break;case this.keys.BOTTOM:t.ctrlKey||t.metaKey||t.shiftKey?this._rotateUp(-w*this.rotateSpeed/this.domElement.clientHeight):this._pan(0,-this.keyPanSpeed),e=!0;break;case this.keys.LEFT:t.ctrlKey||t.metaKey||t.shiftKey?this._rotateLeft(w*this.rotateSpeed/this.domElement.clientHeight):this._pan(this.keyPanSpeed,0),e=!0;break;case this.keys.RIGHT:t.ctrlKey||t.metaKey||t.shiftKey?this._rotateLeft(-w*this.rotateSpeed/this.domElement.clientHeight):this._pan(-this.keyPanSpeed,0),e=!0;break}e&&(t.preventDefault(),this.update())}_handleTouchStartRotate(t){if(this._pointers.length===1)this._rotateStart.set(t.pageX,t.pageY);else{const e=this._getSecondPointerPosition(t),i=.5*(t.pageX+e.x),o=.5*(t.pageY+e.y);this._rotateStart.set(i,o)}}_handleTouchStartPan(t){if(this._pointers.length===1)this._panStart.set(t.pageX,t.pageY);else{const e=this._getSecondPointerPosition(t),i=.5*(t.pageX+e.x),o=.5*(t.pageY+e.y);this._panStart.set(i,o)}}_handleTouchStartDolly(t){const e=this._getSecondPointerPosition(t),i=t.pageX-e.x,o=t.pageY-e.y,n=Math.sqrt(i*i+o*o);this._dollyStart.set(0,n)}_handleTouchStartDollyPan(t){this.enableZoom&&this._handleTouchStartDolly(t),this.enablePan&&this._handleTouchStartPan(t)}_handleTouchStartDollyRotate(t){this.enableZoom&&this._handleTouchStartDolly(t),this.enableRotate&&this._handleTouchStartRotate(t)}_handleTouchMoveRotate(t){if(this._pointers.length==1)this._rotateEnd.set(t.pageX,t.pageY);else{const i=this._getSecondPointerPosition(t),o=.5*(t.pageX+i.x),n=.5*(t.pageY+i.y);this._rotateEnd.set(o,n)}this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);const e=this.domElement;this._rotateLeft(w*this._rotateDelta.x/e.clientHeight),this._rotateUp(w*this._rotateDelta.y/e.clientHeight),this._rotateStart.copy(this._rotateEnd)}_handleTouchMovePan(t){if(this._pointers.length===1)this._panEnd.set(t.pageX,t.pageY);else{const e=this._getSecondPointerPosition(t),i=.5*(t.pageX+e.x),o=.5*(t.pageY+e.y);this._panEnd.set(i,o)}this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd)}_handleTouchMoveDolly(t){const e=this._getSecondPointerPosition(t),i=t.pageX-e.x,o=t.pageY-e.y,n=Math.sqrt(i*i+o*o);this._dollyEnd.set(0,n),this._dollyDelta.set(0,Math.pow(this._dollyEnd.y/this._dollyStart.y,this.zoomSpeed)),this._dollyOut(this._dollyDelta.y),this._dollyStart.copy(this._dollyEnd);const a=(t.pageX+e.x)*.5,r=(t.pageY+e.y)*.5;this._updateZoomParameters(a,r)}_handleTouchMoveDollyPan(t){this.enableZoom&&this._handleTouchMoveDolly(t),this.enablePan&&this._handleTouchMovePan(t)}_handleTouchMoveDollyRotate(t){this.enableZoom&&this._handleTouchMoveDolly(t),this.enableRotate&&this._handleTouchMoveRotate(t)}_addPointer(t){this._pointers.push(t.pointerId)}_removePointer(t){delete this._pointerPositions[t.pointerId];for(let e=0;e<this._pointers.length;e++)if(this._pointers[e]==t.pointerId){this._pointers.splice(e,1);return}}_isTrackingPointer(t){for(let e=0;e<this._pointers.length;e++)if(this._pointers[e]==t.pointerId)return!0;return!1}_trackPointer(t){let e=this._pointerPositions[t.pointerId];e===void 0&&(e=new T,this._pointerPositions[t.pointerId]=e),e.set(t.pageX,t.pageY)}_getSecondPointerPosition(t){const e=t.pointerId===this._pointers[0]?this._pointers[1]:this._pointers[0];return this._pointerPositions[e]}_customWheelEvent(t){const e=t.deltaMode,i={clientX:t.clientX,clientY:t.clientY,deltaY:t.deltaY};switch(e){case 1:i.deltaY*=16;break;case 2:i.deltaY*=100;break}return t.ctrlKey&&!this._controlActive&&(i.deltaY*=10),i}}function ct(s){this.enabled!==!1&&(this._pointers.length===0&&(this.domElement.setPointerCapture(s.pointerId),this.domElement.addEventListener("pointermove",this._onPointerMove),this.domElement.addEventListener("pointerup",this._onPointerUp)),!this._isTrackingPointer(s)&&(this._addPointer(s),s.pointerType==="touch"?this._onTouchStart(s):this._onMouseDown(s)))}function dt(s){this.enabled!==!1&&(s.pointerType==="touch"?this._onTouchMove(s):this._onMouseMove(s))}function pt(s){switch(this._removePointer(s),this._pointers.length){case 0:this.domElement.releasePointerCapture(s.pointerId),this.domElement.removeEventListener("pointermove",this._onPointerMove),this.domElement.removeEventListener("pointerup",this._onPointerUp),this.dispatchEvent(X),this.state=c.NONE;break;case 1:const t=this._pointers[0],e=this._pointerPositions[t];this._onTouchStart({pointerId:t,pageX:e.x,pageY:e.y});break}}function ut(s){let t;switch(s.button){case 0:t=this.mouseButtons.LEFT;break;case 1:t=this.mouseButtons.MIDDLE;break;case 2:t=this.mouseButtons.RIGHT;break;default:t=-1}switch(t){case L.DOLLY:if(this.enableZoom===!1)return;this._handleMouseDownDolly(s),this.state=c.DOLLY;break;case L.ROTATE:if(s.ctrlKey||s.metaKey||s.shiftKey){if(this.enablePan===!1)return;this._handleMouseDownPan(s),this.state=c.PAN}else{if(this.enableRotate===!1)return;this._handleMouseDownRotate(s),this.state=c.ROTATE}break;case L.PAN:if(s.ctrlKey||s.metaKey||s.shiftKey){if(this.enableRotate===!1)return;this._handleMouseDownRotate(s),this.state=c.ROTATE}else{if(this.enablePan===!1)return;this._handleMouseDownPan(s),this.state=c.PAN}break;default:this.state=c.NONE}this.state!==c.NONE&&this.dispatchEvent(k)}function mt(s){switch(this.state){case c.ROTATE:if(this.enableRotate===!1)return;this._handleMouseMoveRotate(s);break;case c.DOLLY:if(this.enableZoom===!1)return;this._handleMouseMoveDolly(s);break;case c.PAN:if(this.enablePan===!1)return;this._handleMouseMovePan(s);break}}function _t(s){this.enabled===!1||this.enableZoom===!1||this.state!==c.NONE||(s.preventDefault(),this.dispatchEvent(k),this._handleMouseWheel(this._customWheelEvent(s)),this.dispatchEvent(X))}function ft(s){this.enabled===!1||this.enablePan===!1||this._handleKeyDown(s)}function yt(s){switch(this._trackPointer(s),this._pointers.length){case 1:switch(this.touches.ONE){case A.ROTATE:if(this.enableRotate===!1)return;this._handleTouchStartRotate(s),this.state=c.TOUCH_ROTATE;break;case A.PAN:if(this.enablePan===!1)return;this._handleTouchStartPan(s),this.state=c.TOUCH_PAN;break;default:this.state=c.NONE}break;case 2:switch(this.touches.TWO){case A.DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchStartDollyPan(s),this.state=c.TOUCH_DOLLY_PAN;break;case A.DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchStartDollyRotate(s),this.state=c.TOUCH_DOLLY_ROTATE;break;default:this.state=c.NONE}break;default:this.state=c.NONE}this.state!==c.NONE&&this.dispatchEvent(k)}function gt(s){switch(this._trackPointer(s),this.state){case c.TOUCH_ROTATE:if(this.enableRotate===!1)return;this._handleTouchMoveRotate(s),this.update();break;case c.TOUCH_PAN:if(this.enablePan===!1)return;this._handleTouchMovePan(s),this.update();break;case c.TOUCH_DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchMoveDollyPan(s),this.update();break;case c.TOUCH_DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchMoveDollyRotate(s),this.update();break;default:this.state=c.NONE}}function wt(s){this.enabled!==!1&&s.preventDefault()}function bt(s){s.key==="Control"&&(this._controlActive=!0,this.domElement.getRootNode().addEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}function Pt(s){s.key==="Control"&&(this._controlActive=!1,this.domElement.getRootNode().removeEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}class St extends j{constructor(){super();const t=new $;t.deleteAttribute("uv");const e=new z({side:J}),i=new z,o=new tt(16777215,900,28,2);o.position.set(.418,16.199,.3),this.add(o);const n=new S(t,e);n.position.set(-.757,13.219,.717),n.scale.set(31.713,28.305,28.591),this.add(n);const a=new S(t,i);a.position.set(-10.906,2.009,1.846),a.rotation.set(0,-.195,0),a.scale.set(2.328,7.905,4.651),this.add(a);const r=new S(t,i);r.position.set(-5.607,-.754,-.758),r.rotation.set(0,.994,0),r.scale.set(1.97,1.534,3.955),this.add(r);const h=new S(t,i);h.position.set(6.167,.857,7.803),h.rotation.set(0,.561,0),h.scale.set(3.927,6.285,3.687),this.add(h);const l=new S(t,i);l.position.set(-2.017,.018,6.124),l.rotation.set(0,.333,0),l.scale.set(2.002,4.566,2.064),this.add(l);const b=new S(t,i);b.position.set(2.291,-.756,-2.621),b.rotation.set(0,-.286,0),b.scale.set(1.546,1.552,1.496),this.add(b);const P=new S(t,i);P.position.set(-2.193,-.369,-5.547),P.rotation.set(0,.516,0),P.scale.set(3.875,3.487,2.986),this.add(P);const u=new S(t,x(50));u.position.set(-16.116,14.37,8.208),u.scale.set(.1,2.428,2.739),this.add(u);const y=new S(t,x(50));y.position.set(-16.109,18.021,-8.207),y.scale.set(.1,2.425,2.751),this.add(y);const f=new S(t,x(17));f.position.set(14.904,12.198,-1.832),f.scale.set(.15,4.265,6.331),this.add(f);const g=new S(t,x(43));g.position.set(-.462,8.89,14.52),g.scale.set(4.38,5.441,.088),this.add(g);const p=new S(t,x(20));p.position.set(3.235,11.486,-12.541),p.scale.set(2.5,2,.1),this.add(p);const D=new S(t,x(100));D.position.set(0,20,0),D.scale.set(1,.1,1),this.add(D)}dispose(){const t=new Set;this.traverse(e=>{e.isMesh&&(t.add(e.geometry),t.add(e.material))});for(const e of t)e.dispose()}}function x(s){const t=new et;return t.color.setScalar(s),t}d.registerPlugin(rt);class Et{constructor(t){this.container=t,this.header=this.container.querySelector("header"),this.footer=this.container.querySelector("footer"),this.nav=this.container.querySelector("nav"),this.navMenu=this.container.querySelector(".nav-menu"),this.navDropdown=this.container.querySelector(".nav-dropdown"),this.init()}init(){this.splitText(),d.to(this.container.querySelectorAll("header, main, footer"),{duration:.5,opacity:1}),this.menuAnimation(),this.updateFooterYear(),this.initFooter()}splitText(){let t=Array.from(this.container.querySelectorAll("h1:not([no-split]), h2:not([no-split]), h3:not([no-split]), p:not([no-split]), a:not([no-split]), label:not([no-split]) span:not([no-split]) blockquote:not([no-split])"));this.elementsToSplit=t.filter(e=>!t.some(i=>i!==e&&i.contains(e))),this.elementsToSplit.forEach(e=>{it({target:e,by:"chars"})}),this.setupTextAnimations()}setupTextAnimations(){this.elementsToSplit.forEach(t=>{const e=t.querySelectorAll(".char"),i=t.getAttribute("split-text");if(!t.hasAttribute("no-scroll")){d.set(e,{yPercent:110,opacity:0});let n=d.timeline({scrollTrigger:{trigger:t,start:"top 92%",end:"bottom bottom",invalidateOnRefresh:!0}});i==="chars"?n.to(e,{yPercent:0,stagger:{each:.05},opacity:1,ease:"power4.inOut",duration:1}):i==="intro"?n.to(e,{yPercent:0,opacity:1,delay:1,stagger:{each:.05,from:"center"}}):n.to(e,{yPercent:0,opacity:1,ease:"expo.out",duration:2})}})}menuAnimation(){const t=d.timeline({paused:!0});t.to(".nav-menu-bar",{y:"0px",scale:.8}).to(".nav-menu-bar.top",{rotate:45,duration:.5},"<").to(".nav-menu-bar.btm",{rotate:-45,duration:.5},"<").to(this.navDropdown,{height:"5.5rem"},"<").from(this.navDropdown.querySelectorAll(".word"),{y:"100%",opacity:0,stagger:.1},"<"),this.menuOpen=!1,this.navMenu.addEventListener("click",()=>{this.menuOpen?t.reverse():t.play(),this.menuOpen=!this.menuOpen}),this.container.querySelectorAll(".text-link").forEach(e=>{const i=d.timeline({paused:!0}),o=[...e.querySelectorAll(".word")];i.to(o.at(-1),{x:"30%",duration:.5}),i.to(o.at(-1).querySelectorAll(".char"),{y:"-1.5ch",x:"1.5ch",duration:.5},"<0.1"),e.addEventListener("mouseenter",()=>{i.play()}),e.addEventListener("mouseleave",()=>{i.reverse()})})}updateFooterYear(){const t=new Date().getFullYear();this.footer.querySelector(".footer-year").textContent=`Copyright © ${t} Kim McLear. All Rights Reserved.`}initFooter(){const t=this.container.querySelector(".webgl1"),e=new j,i=new W;i.setDecoderPath("https://cdn.jsdelivr.net/npm/three@0.153.0/examples/jsm/libs/draco/");const o=new U;o.setDRACOLoader(i);const n=[],a=(u,y)=>{const f=y*.5,g=12+Math.random()*10;d.timeline({repeat:-1,delay:f}).to(u.position,{x:3,z:0,duration:g/2,ease:"none"}).to(u.rotation,{y:-1.25,duration:2},"-=2").to(u.position,{x:-5,z:-1,duration:g/2,ease:"none"}).to(u.rotation,{y:1.25,duration:2},"-=2")};o.load("https://cdn.jsdelivr.net/gh/theNkennaAmadi/emil-about@main/dist/models/dove/dove-c.glb",u=>{const y=u.scene,f=u.animations[0];for(let g=0;g<10;g++){const p=st(y);p.scale.set(.4,.4,.4),p.position.set(-5+g*2,Math.random()*2.2,-1+Math.random()*2),p.rotation.y=1.25,e.add(p);const D=new ot(p);D.clipAction(f).setDuration(1.25).play(),n.push(D),a(p,g)}}),e.add(new nt("white",1));const r={width:window.innerWidth,height:window.innerHeight},h=new H(75,r.width/r.height,.1,100);h.position.set(0,.55,2),e.add(h);const l=new Z({canvas:t,alpha:!0,antialias:!0,powerPreference:"high-performance"});l.outputColorSpace=K,l.setSize(r.width,r.height),l.setPixelRatio(Math.min(window.devicePixelRatio,2)),window.addEventListener("resize",()=>{r.width=window.innerWidth,r.height=window.innerHeight,h.aspect=r.width/r.height,h.updateProjectionMatrix(),l.setSize(r.width,r.height),l.setPixelRatio(Math.min(window.devicePixelRatio,2))});const b=new F,P=()=>{const u=b.getDelta();n.forEach(y=>y.update(u)),l.render(e,h),requestAnimationFrame(P)};P()}}new Et(document.querySelector(".page-wrapper"));class Tt{constructor(t){this.container=t,this.scrollWrapper=this.container.querySelector(".about-v-wrapper"),this.scrollContainer=this.container.querySelector(".about-v"),this.viewerNote=this.container.querySelector(".ar-viewer-note"),this.viewerImg=this.container.querySelector(".ar-viewer-img"),this.init()}init(){this.initMarquee(),this.initHorScroll(),this.initARScene()}initMarquee(){this.marquee1=this.container.querySelector(".ab-h-top"),this.marquee2=this.container.querySelector(".ab-h-btm"),this.setupHorizontalLoop(this.marquee1,!0),this.setupHorizontalLoop(this.marquee2,!1)}setupHorizontalLoop(t,e=!1){const i=[...t.querySelectorAll(".ab-h-grid")];return Dt(i,{paused:!1,repeat:-1,speed:window.innerWidth<768?.32:.85,reversed:e})}getScrollAmount(){return this.scrollWidth=this.scrollContainer.scrollWidth,-(this.scrollWidth-window.innerWidth)}initHorScroll(){d.matchMedia().add("(min-width: 800px)",()=>{let e=d.to(this.scrollContainer,{x:()=>this.getScrollAmount(),scrollTrigger:{trigger:this.scrollWrapper,pin:!0,scrub:1,start:"top top",end:()=>`+=${this.getScrollAmount()*-1}`,invalidateOnRefresh:!0}});const i=this.container.querySelector(".about-c");d.timeline().from(".about-c-img",{scale:0,duration:5,ease:"expo.out",scrollTrigger:{containerAnimation:e,trigger:i,start:"0% right",toggleActions:"play none none reverse",scrub:1}}),d.timeline().fromTo(i.querySelectorAll(".char"),{yPercent:110},{yPercent:0,duration:1,overwrite:!0,ease:"expo.out",scrollTrigger:{containerAnimation:e,trigger:i,start:"0% 80%",toggleActions:"play none none reverse",scrub:1}})})}initARScene(){this.viewerNote.addEventListener("mouseenter",()=>{d.to(this.viewerImg,{opacity:1,duration:.5,ease:"power2.out"})}),this.viewerNote.addEventListener("mousemove",f=>{d.to(this.viewerImg,{x:f.clientX/35,duration:.5,ease:"power2.out"})}),this.viewerNote.addEventListener("mouseleave",()=>{d.to(this.viewerImg,{opacity:0,duration:.5,ease:"power2.out"})});const t=document.querySelector(".webgl-ar"),e=new j,i=new W;i.setDecoderPath("https://cdn.jsdelivr.net/npm/three@0.153.0/examples/jsm/libs/draco/");const o=new U;o.setDRACOLoader(i);let n=null;o.load("https://cdn.jsdelivr.net/gh/theNkennaAmadi/videos@main/kim-AR-comp.glb",f=>{n=f.scene,n.scale.set(.4,.4,.4),n.position.set(0,0,0),n.exposure=1,e.add(n)});const a={width:window.innerWidth>768?window.innerWidth:window.innerWidth*.85,height:window.innerWidth>768?window.innerHeight:window.innerWidth*.85};window.addEventListener("resize",()=>{a.width=window.innerWidth>768?window.innerWidth:window.innerWidth*.85,a.height=window.innerWidth>768?window.innerHeight:window.innerWidth*.85,r.aspect=a.width/a.height,r.updateProjectionMatrix(),l.setSize(a.width,a.height),l.setPixelRatio(Math.min(window.devicePixelRatio,2))});const r=new H(75,a.width/a.height,.1,100);r.position.set(0,.5,1),e.add(r);const h=new lt(r,t);h.target.y=.5,h.enableZoom=!1,h.enableDamping=!0;const l=new Z({canvas:t,alpha:!0,antialias:!0,powerPreference:"high-performance"});l.outputColorSpace=K,l.setSize(a.width,a.height),l.setPixelRatio(Math.min(window.devicePixelRatio,2));let b=new at(l);b.compileEquirectangularShader();const P=b.fromScene(new St).texture;e.environment=P;const u=new F,y=()=>{u.getElapsedTime(),h.update(),l.render(e,r),window.requestAnimationFrame(y)};y()}}function Dt(s,t){s=d.utils.toArray(s),t=t||{};let e=d.timeline({repeat:t.repeat,paused:t.paused,defaults:{ease:"none"},onReverseComplete:()=>e.totalTime(e.rawTime()+e.duration()*100)}),i=s.length,o=s[0].offsetLeft,n=[],a=[],r=[],h=0,l=(t.speed||1)*100,b=t.snap===!1?m=>m:d.utils.snap(t.snap||1),P,u,y,f,g,p;for(d.set(s,{xPercent:(m,E)=>{let R=a[m]=parseFloat(d.getProperty(E,"width","px"));return r[m]=b(parseFloat(d.getProperty(E,"x","px"))/R*100+d.getProperty(E,"xPercent")),r[m]}}),d.set(s,{x:0}),P=s[i-1].offsetLeft+r[i-1]/100*a[i-1]-o+s[i-1].offsetWidth*d.getProperty(s[i-1],"scaleX")+(parseFloat(t.paddingRight)||0),p=0;p<i;p++)g=s[p],u=r[p]/100*a[p],y=g.offsetLeft+u-o,f=y+a[p]*d.getProperty(g,"scaleX"),e.to(g,{xPercent:b((u-f)/a[p]*100),duration:f/l},0).fromTo(g,{xPercent:b((u-f+P)/a[p]*100)},{xPercent:r[p],duration:(u-f+P-u)/l,immediateRender:!1},f/l).add("label"+p,y/l),n[p]=y/l;function D(m,E){E=E||{},Math.abs(m-h)>i/2&&(m+=m>h?-i:i);let R=d.utils.wrap(0,i,m),v=n[R];return v>e.time()!=m>h&&(E.modifiers={time:d.utils.wrap(0,e.duration())},v+=e.duration()*(m>h?1:-1)),h=R,E.overwrite=!0,e.tweenTo(v,E)}return e.next=m=>D(h+1,m),e.previous=m=>D(h-1,m),e.current=()=>h,e.toIndex=(m,E)=>D(m,E),e.times=n,e.progress(1,!0).progress(0,!0),t.reversed&&(e.vars.onReverseComplete(),e.reverse()),e}new Tt(document.querySelector(".page-wrapper"));