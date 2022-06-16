[![Open Source Love svg2](https://badges.frapsoft.com/os/v2/open-source.svg?v=103)](https://gitlab.com/SUSE-UIUX/eos-icons)
[![MIT license](https://img.shields.io/badge/license-MIT-brightgreen.svg)](https://gitlab.com/SUSE-UIUX/eos-icons/-/blob/master/LICENSE)
[![Website shields.io](https://img.shields.io/website-up-down-green-red/http/shields.io.svg)](https://www.eos-icons.com)

![EOS icons](https://res.cloudinary.com/eosdesignsystem/image/upload/v1601287831/npm/eos-icons/npm-banner.jpg)

# EOS icons

Visit the [EOS icons website](https://www.eos-icons.com)

Visit our [Storybook](https://storybook.eos-icons.com/) to use the [react library](https://www.npmjs.com/package/eos-icons-react) in your react project.

## An iconic font created for hi-tech open source software.

EOS icons comprises a set of free and open source icons. Handmade, using strict and consistent guidelines and processes, our icons set is an exceptionally scalable and cohesive solution that will boost the user experience in your applications and websites.

Additionally, EOS icons includes all of Material Design icons (\*) and solves dozens of conflicting and duplicated icons from it.

If you find any issue let us know by [opening an issue.](https://gitlab.com/SUSE-UIUX/eos-icons/issues/new?issue%5Bassignee_id%5D=&issue%5Bmilestone_id%5D=)

(\*) https://github.com/google/material-design-icons

## Migrating from v4 to v5

Go to the [migration guidelines](https://gitlab.com/SUSE-UIUX/eos-icons/-/wikis/Migrating-to-EOS-V5-from-v4) to see what changed in V5 and to get a comprehensive list of all icons removed or renamed, together with their new replacement.

# Installation guide

`npm install eos-icons --save`

## Using EOS icons in your projects

Add the Fonts and CSS file in your project as follows:

1- Add into your projects `<head>` the file `eos-icons.css` which is available inside the folder `dist/css`:

`<link rel="stylesheet" href="assets/eos-icons.css">`

or just add CDN and import icons easily :

`<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/eos-icons/dist/css/eos-icons.css" />`

2- The file mentioned above will look for the font files which you can find inside the folder `dist/fonts` and should move to your `assets/fonts` folder.

3- Use the icons in your html as follows:

```
<i class="eos-icons"> LIGATURE_OF_THE_ICON</i>
```

Where the LIGATURE_OF_THE_ICON is the name of the icon. Use our online tool to see the icon's name: https://www.eos-icons.com/.

## Using animated icons

1- Download the animated icon of your choice from [https://www.eos-icons.com/](https://www.eos-icons.com/) and add them into your project.

2- To use them you need to add the `img` tag in your html.

For example:

```
<img src="icon.svg" />
```

See the other animated icons classes in our [demo page](https://www.eos-icons.com/). Click on the icon you want to use to see the code snippet.

# Development of EOS icons

### Main dependencies

This project uses Webfont for Grunt to build. More info about the project: https://www.npmjs.com/package/grunt-webfont

We use Fontforge to render our icons since the quality is better than using plain node, and it supports Ligatures.
Our icons follow Google Material Icons guidelines one-to-one. This is the main reason for us to use ligatures as well. We made a perfectly compatible icon font for those already using MD icons.
If you want to know more about all the standards we follow for the EOS, visit our public wiki, which is our main internal guideline: https://gitlab.com/SUSE-UIUX/eos/wikis/home

### Installing dependencies

- Clone this repository and go to the folder:

```
git clone git@gitlab.com:SUSE-UIUX/eos-icons.git
cd eos-icons
```

- Make sure you have NODE.js installed, if not:

```
brew install node
```

- Install Grunt globally:

```
npm install -g grunt-cli
```

- Install npm dependencies:

```
npm install
```

Install Fontforge:

On OSX

```
brew install ttfautohint fontforge --with-python
```

You will need to have Xcode installed. First install the command line tool:

```
xcode-select --install
```

And then download the latest version from:

https://developer.apple.com/xcode/

- On Linux

```
sudo apt-get install fontforge ttfautohint
```

## Design and add your SVG icons

Add your icons into the `svg/` folder. All our icons have been designed with Illustrator, but designing with any tool like Inkscape will work just fine, just make sure to export the SVG code is as clean as possible.

Have a look at [our guidelines](https://gitlab.com/SUSE-UIUX/eos-icons/-/wikis/home#designing-new-icons-for-eos-icons) on how to design icons.

SVG file names with more than one word in it should not have a minus character separating the words (e.g.: some-name.svg), instead, use an underscore (e.g.: some_name.svg). The use of spaces in the filename also creates conflicts in the resulting iconic font.

Once you have the svg ready inside the `svg/` folder, all you need to do, is run

```
grunt
```

This will build the assets under the `dist/` folder. Open the demo file in `dist/demo.html` to see the results.

We recommended sizes MD icons use: 18, 24, 36, and 48 pixels, plus 16px which is our minimum allowed size at EOS Design System.

**That's it!!.. easy as pie**

# Our "thank you" section

### Tested for every browser in every device

Thanks to [browserstack](https://www.browserstack.com) and their continuous contribution to open source projects, we continuously test the EOS to make sure all our features and components work perfectly fine in all browsers.
Browserstack helps us make sure our Design System also delivers a peace of mind to all developers and designers making use of our components and layout in their products.
