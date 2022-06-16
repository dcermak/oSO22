;(function () {
  latestIcon('date', 'eos-icons')
  // Switch normal and outline icons
  document
    .getElementById('switch-checkbox')
    .addEventListener('change', function () {
      const selectedTabName = tabSelected()
      if (this.checked) {
        console.log('checked')
        const filled = document.querySelectorAll('.eos-icons')
        let i
        for (i = 0; i < filled.length; i++) {
          filled[i].className = 'eos-icons-outlined'
        }
        latestIcon('dateOutlined', selectedTabName)
      } else {
        const outlined = document.querySelectorAll('.eos-icons-outlined')
        let i
        for (i = 0; i < outlined.length; i++) {
          outlined[i].className = 'eos-icons'
        }
        latestIcon('date', selectedTabName)
      }
    })

  function tabSelected() {
    const tabSelected = document
      .getElementsByClassName('selected')[0]
      .getAttributeNode('data-name').value
    return tabSelected
  }

  // Swithch between EOS and MD tabs
  document.getElementById('tab').onclick = function (e) {
    e.preventDefault()
    const tabName = document.getElementsByClassName('icons-tab')
    const targetName =
      e.target.getAttribute('data-name') ||
      e.target.nextSibling.getAttribute('data-name')
    for (let i = 0; i < tabName.length; i++) {
      tabName[i].className = 'icons-tab'
    }
    e.target.className = 'icons-tab selected'

    // Check for Outlined and filled version
    const outlineCheck = document.getElementById('switch-checkbox').checked
    if (outlineCheck) {
      latestIcon('dateOutlined', targetName)
    } else {
      latestIcon('date', targetName)
    }
  }

  function latestIcon(isOutlined, targetName) {
    // Empty latest section
    document
      .querySelectorAll('.latest-icons .icons__item')
      .forEach((e) => e.remove())

    window
      .fetch('https://gitlab.com/api/v4/projects/4600360/repository/tags')
      .then((response) => response.json())
      .then((tags) => {
        const tagRelease = new Date(tags[0].commit.committed_date)

        // Filter out the icons that are newer than the latest release tag.
        // eslint-disable-next-line no-undef
        const newIconsList = eosIcons.filter((ele) => {
          if (!ele[isOutlined]) return
          const date = ele[isOutlined].split('/')
          const itemDate = new Date(date[2], date[1], date[0])

          if (itemDate > tagRelease) return ele
        })

        // Removes the preview wrap if no new icons are found
        if (newIconsList.length === 0) {
          document.querySelector('.latest').style.display = 'none'
        } else {
          document.querySelector('.latest').style.display = 'block'
        }

        const target = document.querySelector('.latest-icons')
        // Filter EOS and MD icons
        let newIcon
        if (targetName === 'eos-icons') {
          newIcon = newIconsList.filter((ele) => ele.tags.includes('eos'))
        } else {
          newIcon = newIconsList.filter((ele) => !ele.tags.includes('eos'))
        }

        // Appends each icon to the preview wrap
        newIcon.forEach((ele) => {
          const div = document.createElement('div')
          // Detect the icon class in order to inject dinamycally
          const iconClassQuery = document.querySelectorAll('i')
          const iconClass = iconClassQuery[0].className

          div.classList.add('icons__item')
          div.setAttribute('name', ele.name)
          div.innerHTML = `
                <i class="${iconClass}">
                  ${ele.name}
                </i>
                <br>
                ${ele.name}`
          target.append(div)
        })
      })
      .catch((error) => {
        console.error('Error:', error)
      })
  }
})()
