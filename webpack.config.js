


var webpack	= require('webpack')
var config	= {add:function(o){for(var i in o)this[i]=o[i]}}
var env		= process.env.NODE_ENV.split('.')
	env		= {target: env[0], mode: env[1]}

if (env.target == 'server') config.add({
	entry : {'./index.js' : './libs/fw.js'}
})

if (env.mode == 'build') config.add({
	devtool	: 'eval',
	plugins : [
		new webpack.LoaderOptionsPlugin({
			minimize	: true,
			debug		: false
		}),
		new webpack.optimize.UglifyJsPlugin({
			compress: {
				warnings 		: true,
				drop_console	: false
			},
			sourceMap	: true,
			beautify	: false
		})
    ]
}) 
else if (env.mode == 'watch')
	if (env.target == 'server') config.add({
		watch : true
	})

config.add({
    output : {
		filename: '[name]',
        libraryTarget: "umd",
        library: "fw"
	},
    module : {
        loaders	: [
            {
                loader	: 'babel-loader',
				test	: /\.(js|jsx)$/,
				exclude	: /node_modules/,
                query	: {
                    presets	: ['es2015']
                }
            }
        ]
    },
})

module.exports = config

