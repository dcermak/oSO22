;(function () {
  window
    .fetch('../js/glyph-list.json')
    .then((response) => {
      return response.json()
    })
    .then((data) => {
      const target = document.querySelector('#icons')
      // Filter EOS and MD icons
      const ligatures = data.glyphs
      // Appends each icon to the preview wrap
      ligatures.forEach((glyph) => {
        const div = document.createElement('div')

        div.classList.add('icons__item')
        div.setAttribute('name', glyph)
        div.innerHTML = `
                    <i class="eos-icons">
                      ${glyph}
                    </i>
                    <i class="eos-icons-outlined">
                      ${glyph}
                    </i>
                    <br>
                    ${glyph}`
        target.append(div)
      })
    })
    .catch((error) => {
      const errorDiv = document.querySelector('.CORS-error')
      errorDiv.classList.add('visible')
      console.error('Error:', error)
    })
})()
