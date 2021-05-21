import { participants } from "../../models/components/avatar.js"
import { posRot } from "../../scene/components/pos-rot.js"
import { camera } from "../../scene/components/camera.js";
import { noParticipants } from "../../scene/settings.js"
import easingDict from "../easings.js"
import { expressionMorphs, jawNeeded } from "./morph-targets.js"
import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.125/build/three.module.js";
import TWEEN from 'https://cdn.jsdelivr.net/npm/@tweenjs/tween.js@18.5.0/dist/tween.esm.js'

window.allExpression = allExpression
function allExpression(e) {
	for (let i=1; i<noParticipants; i++) {
		expression(i, e)
	}
}

window.expression = expression
export default function expression(who, e) {

	let lenMorphs = participants[who].movableBodyParts.face.morphTargetInfluences.length
	let faceMorphsTo = new Array(lenMorphs).fill(0);
	let faceMorphsHalf = new Array(lenMorphs).fill(0);
	faceMorphsTo[participants[who].movableBodyParts.face.morphTargetDictionary[e]] = 1
	faceMorphsHalf[participants[who].movableBodyParts.face.morphTargetDictionary[e + "Half"]] = 1

	let expressionIn = new TWEEN.Tween(participants[who].movableBodyParts.face.morphTargetInfluences).to(faceMorphsTo, 500)
		.easing(easingDict["cubicOut"])

	let expressionOut = new TWEEN.Tween(participants[who].movableBodyParts.face.morphTargetInfluences).to(faceMorphsHalf, 1500)
		.easing(easingDict["cubicOut"])
		.delay(3000)
	
	expressionIn.chain(expressionOut)
	expressionIn.start()

	expressionIn.onStart( function() {
		participants[who].states.changingExpression = true
		participants[who].states.expression = 'changing'
		if ( jawNeeded[e] ) {
			new TWEEN.Tween(participants[who].movableBodyParts.teeth.morphTargetInfluences).to({"45": expressionMorphs[e].jawOpen}, 500)
			.easing(easingDict["cubicOut"])
			.start()
		}
	})
	expressionOut.onStart( function() {
		participants[who].states.changingExpression = true
		participants[who].states.expression = 'changing'
		if ( jawNeeded[e] ) {
			new TWEEN.Tween(participants[who].movableBodyParts.teeth.morphTargetInfluences).to({"45": expressionMorphs[e].jawOpen/3}, 1500)
			.easing(easingDict["cubicOut"])
			.start()
		}
	})
	expressionIn.onComplete( function() {
		participants[who].states.changingExpression = false
		participants[who].states.expression = e
	})
	expressionOut.onComplete( function() {
		participants[who].states.changingExpression = false
		participants[who].states.expression = e + 'Half'
	})
}

