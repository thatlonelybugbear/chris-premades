import {chris} from '../../../helperFunctions.js';
async function item({speaker, actor, token, character, item, args, scope, workflow}) {
    if (workflow.actor.system.abilities.dex.save < workflow.actor.system.abilities.str.save) return;
    workflow.item = workflow.item.clone({'system.save.scaling': 'dex'}, {'keepId': true});
}
async function save({speaker, actor, token, character, item, args, scope, workflow}) {
    if (workflow.failedSaves.size != 1) return;
    let effectData = {
        'label': workflow.item.name,
        'icon': workflow.item.img,
        'changes': [
            {
                'key': 'flags.midi-qol.disadvantage.ability.save.wis',
                'mode': 0,
                'value': '1',
                'priority': 20
            }
        ],
        'duration': {
            'seconds': 12
        },
        'origin': workflow.item.uuid,
        'flags': {
            'dae': {
                'specialDuration': [
                    'turnEndSource'
                ]
            }
        }
    };
    let heavyArmor = workflow.targets.first().actor.items.filter(i => i.system.armor?.type === 'heavy' && i.system.equipped);
    console.log(heavyArmor);
    if (!heavyArmor.length) effectData.changes.push({
        'key': 'system.attributes.ac.bonus',
        'mode': 2,
        'value': -workflow.targets.first().actor.system.abilities.dex.mod,
        'priority': 20
    });
    await chris.createEffect(workflow.targets.first().actor, effectData);
    let effectData2 = {
        'duration': {
            'seconds': 12
        },
        'icon': 'modules/dfreds-convenient-effects/images/reaction.svg',
        'label': 'Reaction',
        'origin': workflow.item.uuid,
        'flags': {
            'core': {
                'statusId': 'Convenient Effect: Reaction'
            },
            'dfreds-convenient-effects': {
                'description': 'No active effects and expires on turn start',
                'isConvenient': true,
                'isDynamic': false,
                'isViewable': true,
                'nestedEffects': [],
                'subEffects': []
            },
            'dae': {
                'specialDuration': [
                    'turnEndSource',
                    'shortRest',
                    'longRest'
                ]
            }
        }
    };
    await chris.createEffect(workflow.targets.first().actor, effectData2);
}
export let concussiveSmash = {
    'item': item,
    'save': save
}