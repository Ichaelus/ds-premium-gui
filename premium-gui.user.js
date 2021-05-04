// ==UserScript==
// @name        DS: Premium GUI
// @version     1.0
// @namespace   Ichaelus
// @author      Ichaelus
// @copyright   Ichaelus
// @description Imitate GUI elements that would usually be paid
// @updateURL   https://raw.githubusercontent.com/Ichaelus/ds-premium-gui/main/premium-gui.user.js
// @include     *.die-staemme.de*
// @exclude     *.die-staemme.de
// @include     *.tribalwars.net*
// @include     *.staemme.ch*
// @include     *.tribalwars.nl*
// @include     *.plemiona.pl*
// @include     *.tribalwars.se*
// @include     *.tribalwars.com.pt*
// @include     *.divokekmeny.cz*
// @include     *.bujokjeonjaeng.org*
// @include     *.triburile.ro*
// @include     *.voyna-plemyon.ru*
// @include     *.fyletikesmaxes.gr*
// @include     *.tribalwars.no.com*
// @include     *.divoke-kmene.sk*
// @include     *.klanhaboru.hu*
// @include     *.tribalwars.dk*
// @include     *.tribals.it*
// @include     *.klanlar.org*
// @include     *.guerretribale.fr*
// @include     *.guerrastribales.es*
// @include     *.tribalwars.fi*
// @include     *.tribalwars.ae*
// @include     *.tribalwars.co.uk*
// @include     *.vojnaplemen.si*
// @include     *.plemena.com*
// @include     *.tribalwars.asia*
// @include     *.tribalwars.works*
// @include     *.tribalwars.us*
// @include     *.tribalwarsmasters.net*
// @include     *.tribalwars.com.br*
// @grant       unsafeWindow
// ==/UserScript==

// Only boot once in different frames
if (window.top !== window.self) {
  console.log('[#] Frame blocked')
  return
}

const W = unsafeWindow
const CAPACITY_RED_WARNING_PERCENT = 85
const CAPACITY_ORANGE_WARNING_PERCENT = 70
const MAP_SIZE = 13
const MINIMAP_SIZE = 175

function getVillageBaseURL() {
  if (parseInt(W.game_data.player.sitter) != 0) {
    return `/game.php?t=${W.game_data.player.id}`
  } else {
    return '/game.php?t'
  }
}

function getVillageURL(urlFragment) {
  return `${getVillageBaseURL()}${urlFragment}`
}

function getBuildingIconTag(building, size) {
  const sizeModifier = size == 'big' ? 'mid' : ''
  const gameBuild = game_data.version.split(' ')[0]
  return `<img src='https://dsde.innogamescdn.com/asset/${gameBuild}/graphic/buildings/${sizeModifier}${building}.png'>`
}

function getIconTag(icon) {
  const gameBuild = game_data.version.split(' ')[0]
  return `<img src='https://dsde.innogamescdn.com/asset/${gameBuild}/graphic/icons/${icon}.png'>`
}

function getUnitIcon(tag) {
  const gameBuild = game_data.version.split(' ')[0]
  return `<img src='https://dsde.innogamescdn.com/asset/${gameBuild}/graphic/unit/unit_${tag}.png'>`
}

class Village {
  appendVillageSwitchingArrows() {
    if(W.game_data.player.villages === '1')
      return // No point in adding arrows when there is only a single village
    const goBackArrowHTML = `<td class="box-item icon-box separate arrowCell">
        <a id="village_switch_left" class="village_switch_link" href="${getVillageURL(`&village=p${W.game_data.village.id}&screen=${W.game_data.screen}`)}" title="Vorheriges Dorf (Taste A)">
          <span class="arrowLeft"></span>
        </a>
      </td>`
    const goForwardArrowHTML = `<td class="box-item icon-box arrowCell">
        <a id="village_switch_right" class="village_switch_link" href="${getVillageURL(`&village=n${W.game_data.village.id}&screen=${W.game_data.screen}`)}" title="Nächstes Dorf (Taste D)">
          <span class="arrowRight"></span>
        </a>
      </td>`
    W.document.querySelector('#menu_row2_village').insertAdjacentHTML('beforebegin', goBackArrowHTML)
    W.document.querySelector('#menu_row2_village').insertAdjacentHTML('beforebegin', goForwardArrowHTML)
  }
}


class QuickLinkList {
  init() {
    const villageID = W.game_data.village.id
    const quickbarHTML = `<div id="quickbar_outer" height="36px" align="center" cellspacing="0" width="100%">
      <table id="quickbar_inner" style="border-collapse: collapse" width="100%">
        <tbody>
          <tr class="topborder">
            <td class="left"></td>
            <td class="main"></td>
            <td class="right"></td>
          </tr>
          <tr>
            <td class="left"></td>
            <td id="quickbar_contents" class="main">
              <ul class="menu quickbar">
                <li class="quickbar_item"><span><a class="quickbar_link" href="${getVillageURL(`&village=${villageID}&screen=main`)}">
                  ${getBuildingIconTag('main', 'small')} Hauptgebäude</a></span>
                </li>
                <li class="quickbar_item"><span><a class="quickbar_link" href="${getVillageURL(`&village=${villageID}&screen=train`)}">
                  ${getBuildingIconTag('barracks', 'small')} Rekrutieren</a></span>
                </li>
                <li class="quickbar_item"><span><a class="quickbar_link" href="${getVillageURL(`&village=${villageID}&screen=snob`)}">
                  ${getBuildingIconTag('snob', 'small')} Adelshof</a></span>
                </li>
                <li class="quickbar_item"><span><a class="quickbar_link" href="${getVillageURL(`&village=${villageID}&screen=smith`)}">
                  ${getBuildingIconTag('smith', 'small')} Schmiede</a></span>
                </li>
                <li class="quickbar_item"><span><a class="quickbar_link" href="${getVillageURL(`&village=${villageID}&screen=place`)}">
                  ${getBuildingIconTag('place', 'small')} Versammlungsplatz</a></span>
                </li>
                <li class="quickbar_item"><span><a class="quickbar_link" href="${getVillageURL(`&village=${villageID}&screen=place&mode=scavenge`)}">
                  ${getIconTag('report_scavenging')} Raubzug</a></span>
                </li>
                <li class="quickbar_item"><span><a class="quickbar_link" href="${getVillageURL(`&village=${villageID}&screen=market`)}">
                  ${getBuildingIconTag('market', 'small')} Marktplatz</a></span>
                </li>
              </ul>
            </td>
            <td class="right"></td>
          </tr>
          <tr class="bottomborder">
            <td class="left"></td>
            <td class="main"></td>
            <td class="right"></td>
          </tr>
          <tr>
            <td class="shadow" colspan="3">
            <div class="leftshadow">
            </div>
            <div class="rightshadow">
            </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>`
    W.document.querySelector('.maincell .oldStyleOnly').insertAdjacentHTML('afterend', quickbarHTML)
  }
}

class InfoVillage {
  appendReservationAction(){
    const villageID = W.VillageInfo.village_id
    const villageActionsTable = document.querySelector('table.vis:nth-child(2) > tbody:nth-child(1)')
    villageActionsTable.insertAdjacentHTML('beforeend', `<tr>
      <td colspan="2">
        <a href="${getVillageURL(`&village=${villageID}&mode=reservations&screen=ally`)}" data-confirm-msg="">
          <span class="action-icon-container">
            <span class="icon header reserve"></span>
          </span> Zum Adelsplaner
        </a>
      </td>
    </tr>`)
  }
}

class AttackFormatter {
  formatIncomingAttacksToMarkdown() {
    const attacks = document.querySelectorAll('tr.no_ignored_command')
    if (attacks.length != 0) {
      let markdown = "[table][**]Herkunft[||]Ankunft um[/**]"
      attacks.forEach(function (attack) {
        let attackUrl = attack.querySelector('.quickedit-content a').getAttribute('href')
        let attackLabel = attack.querySelector('.quickedit-label').innerText.trim()
        let suffix = attack.querySelector('.grey.small').parentElement.innerText.trim()
        markdown += `[*][url='${location.protocol}//${location.host}${attackUrl}']${attackLabel}[/url][|]${suffix}`
      })
      markdown += '[/table]'
      document.querySelector('#commands_incomings').onclick = alert.bind(this, markdown)
    }
  }
}

class CapacityFormatter {
  colorizeCapacityWarnings(){
    const woodQuotient = W.game_data.village.wood / W.game_data.village.storage_max
    const stoneQuotient = W.game_data.village.stone / W.game_data.village.storage_max
    const ironQuotient = W.game_data.village.iron / W.game_data.village.storage_max
    const pupulationQuotient = W.game_data.village.pop / W.game_data.village.pop_max
    const resourceTable = W.document.querySelector('td.topAlign:nth-child(4) > table:nth-child(1) > tbody:nth-child(1) > tr:nth-child(1) > td:nth-child(1) > table:nth-child(1) > tbody:nth-child(1) > tr:nth-child(1)')
    this.colorizeCapacity(resourceTable.querySelector('td:nth-child(2)'), woodQuotient)
    this.colorizeCapacity(resourceTable.querySelector('td:nth-child(4)'), stoneQuotient)
    this.colorizeCapacity(resourceTable.querySelector('td:nth-child(6)'), ironQuotient)
    this.colorizeCapacity(resourceTable.querySelector('#pop_current_label'), pupulationQuotient)
  }

  colorizeCapacity(element, quotient) {
    if (quotient > CAPACITY_RED_WARNING_PERCENT / 100) {
      element.style.color = '#D10303'
    } else if (quotient > CAPACITY_ORANGE_WARNING_PERCENT / 100) {
      element.style.color = '#C93636'
    } else {
      element.style.color = '#016201'
    }
  }
}


class PremiumMap {
  constructor() {
    this.lastCoordinates = [0, 0]
    this.units = {
      'spear': {
        'speed': 0.0009259259259,
        'can_attack': true,
      },
      'knight': {
        'speed': 0.001666666667,
        'can_attack': true,
      },
      'sword': {
        'speed': 0.0007575757576,
        'can_attack': true,
      },
      'axe': {
        'speed': 0.0009259259259,
        'can_attack': true,
      },
      'archer': {
        'speed': 0.0009259259259,
        'can_attack': true,
      },
      'spy': {
        'speed': 0.001851851852,
        'can_attack': true,
      },
      'light': {
        'speed': 0.001666666667,
        'can_attack': true,
      },
      'marcher': {
        'speed': 0.001666666667,
        'can_attack': true,
      },
      'heavy': {
        'speed': 0.001515151515,
        'can_attack': true,
      },
      'ram': {
        'speed': 0.0005555555556,
        'can_attack': true,
      },
      'catapult': {
        'speed': 0.0005555555556,
        'can_attack': true,
      },
      'snob': {
        'speed': 0.0004761904762,
        'can_attack': true,
      },
      'militia': {
        'speed': 1,
        'can_attack': false,
      }
    }
  }

  init() {
    W.document.querySelector('.pa-hint-map').remove()
    W.TWMap.premium = true
    W.TWMap._lastNotifiedMapsize = `${MAP_SIZE}x${MAP_SIZE}-50x50`
    W.TWMap.resize(MAP_SIZE, MAP_SIZE)
    W.TWMap._lastNotifiedMapsize = `${MAP_SIZE}x${MAP_SIZE}-${MINIMAP_SIZE}x${MINIMAP_SIZE}`
    W.TWMap.minimap.resize(MINIMAP_SIZE, MINIMAP_SIZE)
    W.document.querySelector('#fullscreen').style.display = 'block'
    W.document.querySelector('#map').onmousemove = this.hoverVillage.bind(this)
  }

  hoverVillage(event) {
    const coordinates = this.coordinatesForEvent(event)
    const sameAsOldCoords = this.lastCoordinates[0] == coordinates[0] && this.lastCoordinates[1] == coordinates[1]
    if (!sameAsOldCoords) {
      const distance = this.getVillageDistance(W.game_data.village.x, W.game_data.village.y, coordinates[0], coordinates[1])
      setTimeout((function () {
        let s1 = `
              <tr class="info_additional">
                <td colspan="2">
                  <table style="border: 1px solid rgb(222, 211, 185)" cellpadding="0" cellspacing="0" width="100%">
                    <tbody>
                      <tr class="center">`
        let s2 = `
                      </tr>
                      <tr class="center">`
        let ind = 0
        for (const [name, unit] of Object.entries(this.units)) {
          if (!unit.can_attack) {
            continue
          } else {
            ind++
            const duration = this.msToTimeString(Math.round(1000 * distance / unit.speed), 'short')
            const background = ind % 2 == 0 ? 'rgb(222, 211, 185)' : 'rgb(248, 244, 232)'
            s1 += `<td style="padding: 2px background-color: ${background}">${getUnitIcon(name)}</td>`
            s2 += `<td style="padding: 2px background-color: ${background}">${duration}</td>`
          }
        }
        s2 += `</tr>
                  </tbody>
                </table>
              </td>
            </tr>`
        let troopTimesTable = s1 + s2
        W.document.querySelectorAll('.info_additional').forEach((element) => element.remove())
        W.document.querySelector('#info_content > tbody:nth-child(1)').insertAdjacentHTML('afterbegin', `
                <tr class="info_additional">
                    <td>Entfernung:</td>
                    <td>${distance.toFixed(1)} Felder</td>
                </tr>
                ${troopTimesTable}
              `)
      }.bind(this)), 15)
    }
    this.lastCoordinates = coordinates
  }

  coordinatesForEvent(event) {
    const mapOffset = this.getOffset(W.document.querySelector('#map'))
    const position = [
      event.pageX - mapOffset.left + W.TWMap.map.pos[0],
      event.pageY - mapOffset.top + W.TWMap.map.pos[1]
    ]
    const x = Math.floor(position[0] / W.TWMap.map.scale[0])
    const y = Math.floor(position[1] / W.TWMap.map.scale[1])
    return [x, y]
  }

  getOffset(el) {
    const box = el.getBoundingClientRect()

    return {
      top: box.top + window.pageYOffset - document.documentElement.clientTop,
      left: box.left + window.pageXOffset - document.documentElement.clientLeft
    }
  }
  // Returns the absolute direct distance between two villages
  getVillageDistance(x1, y1, x2, y2) {
    const xSquared = Math.pow(Math.abs(x1 - x2), 2)
    const ySquared = Math.pow(Math.abs(y1 - y2), 2)
    return Math.sqrt(xSquared + ySquared)
  }

  msToTimeString(ms, type) {
    let hour = 0
    let minute = 0
    let second = parseInt(ms / 1000) + (ms % 1000 >= 500 ? 1 : 0)
    while (second >= 3600) {
      hour++
      second -= 3600
    }
    while (second >= 60) {
      minute++
      second -= 60
    }
    if (minute < 10) {
      minute = '0' + minute
    }
    if (second < 10) {
      second = '0' + second
    }
    if (type === 'short') {
      return hour + ':' + minute + ':' + second
    } else {
      return hour + 'h ' + minute + 'm ' + second + 's'
    }
  }
}

class PremiumGUI {
  init() {
    new Village().appendVillageSwitchingArrows()
    new QuickLinkList().init()
    new CapacityFormatter().colorizeCapacityWarnings()
    switch (W.game_data.screen) {
      case 'info_village': {
        new InfoVillage().appendReservationAction()
        break
      }
      case 'overview': {
        new AttackFormatter().formatIncomingAttacksToMarkdown()
        break
      }
      case 'map': {
        new PremiumMap().init()
        break
      }
    }
  }
}

if (W.game_data.player.premium != true) {
  new PremiumGUI().init()
}
