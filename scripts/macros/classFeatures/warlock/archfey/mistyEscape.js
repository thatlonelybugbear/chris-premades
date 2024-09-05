import {Teleport} from '../../../../lib/teleport.js';
import {effectUtils, itemUtils} from '../../../../utils.js';

async function use({workflow}) {
    let effectData = {
        name: workflow.item.name,
        img: workflow.item.img,
        origin: workflow.item.uuid,
        flags: {
            dae: {
                specialDuration: [
                    '1Attack',
                    '1Spell',
                    'turnStartSource'
                ]
            },
            'chris-premades': {
                conditions: ['invisible']
            }
        }
    };
    let animation = itemUtils.getConfig(workflow.item, 'playAnimation') ? 'mistyStep' : 'none';
    await Teleport.target([workflow.token], workflow.token, {range: 60, animation});
    await effectUtils.createEffect(workflow.actor, effectData);
}
export let mistyEscape = {
    name: 'Misty Escape',
    version: '0.12.54',
    midi: {
        item: [
            {
                pass: 'rollFinished',
                macro: use,
                priority: 50
            }
        ]
    }
};