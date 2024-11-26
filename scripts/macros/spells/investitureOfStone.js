import {activityUtils, compendiumUtils, constants, effectUtils, errors, genericUtils, itemUtils, workflowUtils} from '../../utils.js';
import {proneOnFail} from '../generic/proneOnFail.js';

async function use({workflow}) {
    let activityIdentifier = activityUtils.getIdentifier(workflow.activity);
    if (activityIdentifier === genericUtils.getIdentifier(workflow.item)) {
        let concentrationEffect = effectUtils.getConcentrationEffect(workflow.actor, workflow.item);
        let feature = activityUtils.getActivityByIdentifier(workflow.item, 'investitureOfStoneEarthquake', {strict: true});
        if (!feature) {
            if (concentrationEffect) await genericUtils.remove(concentrationEffect);
            return;
        }
        let effectData = {
            name: workflow.item.name,
            img: workflow.item.img,
            origin: workflow.item.uuid,
            duration: itemUtils.convertDuration(workflow.item),
            changes: [
                {
                    key: 'system.traits.dr.custom',
                    mode: 0,
                    value: 'Non-Magical Physical',
                    priority: 20
                }
            ]
        };
        await effectUtils.createEffect(workflow.actor, effectData, {
            concentrationItem: workflow.item, 
            strictlyInterdependent: true, 
            identifier: 'investitureOfStone', 
            vae: [{
                type: 'use', 
                name: feature.name,
                identifier: 'investitureOfStone', 
                activityIdentifier: 'investitureOfStoneEarthquake'
            }],
            unhideActivities: {
                itemUuid: workflow.item.uuid,
                activityIdentifiers: ['investitureOfStoneEarthquake'],
                favorite: true
            }
        });
        if (concentrationEffect) await genericUtils.update(concentrationEffect, {duration: effectData.duration});
    } else if (activityIdentifier === 'investitureOfStoneEarthquake') {
        await proneOnFail.midi.item[0].macro({workflow});
    }
}
async function early({workflow}) {
    if (activityUtils.getIdentifier(workflow.activity) !== 'investitureOfStoneEarthquake') return;
    workflowUtils.skipDialog(workflow);
}
export let investitureOfStone = {
    name: 'Investiture of Stone',
    version: '1.1.0',
    midi: {
        item: [
            {
                pass: 'rollFinished',
                macro: use,
                priority: 50
            },
            {
                pass: 'preTargeting',
                macro: early,
                priority: 50
            }
        ]
    }
};