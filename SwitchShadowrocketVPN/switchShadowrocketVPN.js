/* 
 * https://github.com/lic2870/JSBox
 *@version 1.0
 *@author lic2870
 *@date 2018.8.3
 *@note
 * 1. 切换 Shadowrocket 的 VPN 状态
 */


var vpnState = $network.proxy_settings.HTTPEnable
if (vpnState == 1) {
  $app.openURL("shadowrocket://disconnect")
} else {
  $app.openURL("shadowrocket://connect")
}
