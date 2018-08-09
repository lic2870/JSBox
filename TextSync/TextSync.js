/* 
 * https://github.com/lic2870/JSBox
 * @version 1.0
 * @date 2018.8.2
 * @note
 * 1. 在脚本“文本收藏夹”的基础上，将文本保存到 iCloud Drive 的 txt 文件中，方便在 PC 端查看
 * 2. 感谢@cyan和@Se7en，这个脚本在你们的脚本基础上完善
 */

$app.strings = {
  "en": {
    "MAIN_TITLE": "Text Sync",
    "PLACEHOLDER": "Please input text here",
    "COPIED": "Copied",
    "ERROR": "Error",
    "CANCEL": "Cancel"
  },
  "zh-Hans": {
    "MAIN_TITLE": "文本同步",
    "PLACEHOLDER": "输入要同步的文字",
    "COPIED": "已复制",
    "ERROR": "哦豁，出错了",
    "CANCEL": "取消"
  }
}

var txt = $drive.read("TextSync.txt")

if (txt === undefined) {
  var success = $drive.write({
    data: $data({ string: "文本同步至 iCloud Drive\r\n点击复制，左划删除" }),
    path: "TextSync.txt"
  })
  txt = $drive.read("TextSync.txt")
  if (txt === undefined) {
    $ui.toast($l10n("ERROR"))
    return
  }
}

var clips = $text.decodeData({ data: txt, encoding: 4 })
clips = clips.split("\r\n")

$ui.render({
  props: {
    title: $l10n("MAIN_TITLE")
  },
  views: [{
    type: "input",
    props: {
      placeholder: $l10n("PLACEHOLDER")
    },
    layout: function (make) {
      make.top.left.inset(10)
      make.right.inset(10)
      make.height.equalTo(32)
    },
    events: {
      ready: function (sender) {
        sender.focus()
        if ($clipboard.text == undefined) {

        } else {
          sender.text = $clipboard.text
        }
      },
      returned: function (sender) {
        if (sender.text == "") {
          sender.blur()
          return
        }
        insertItem(sender.text)
        sender.text = ""
      }
    }
  },
  {
    type: "list",
    props: {
      id: "list",
      data: clips,
      actions: [{
        title: "delete",
        handler: function (sender, indexPath) {
          deleteItem(indexPath)
        }
      }]
    },
    layout: function (make) {
      make.left.bottom.right.equalTo(0)
      make.top.equalTo($("input").bottom).offset(10)
    },
    events: {
      didSelect: function (sender, indexPath, title) {
        $clipboard.text = title
        $device.taptic()
        $ui.toast($l10n("COPIED"))
      }
    }
  }
  ]
})

var listView = $("list")
listView.data = clips

function insertItem(text) {
  clips.unshift(text)
  listView.insert({
    index: 0,
    value: text
  })
  saveItems()
}

function deleteItem(indexPath) {
  var text = clips[indexPath.row]
  var index = clips.indexOf(text)
  if (index >= 0) {
    clips.splice(index, 1)
    saveItems()
  }
}

function saveItems() {
  var success = $drive.write({
    data: $data({ string: clips.join("\r\n") }),
    path: "TextSync.txt"
  })
}