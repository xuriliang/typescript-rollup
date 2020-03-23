import typescript from "@rollup/plugin-typescript";
import { uglify } from "rollup-plugin-uglify";

const env = process.env.BUILD;

const config = {
	input: "src/index.ts",
	output: {
		name : 'xiaoman',
		file: 'output/xiaoman-phone.js',
		format: "iife",
		banner: "/* xiaoman-phone.js version 2.0.0 */"
	},
	plugins: [typescript()]
};

if (env === "production") {
	config.plugins.push(
		uglify({
			compress: {
				pure_getters: true,
				unsafe: true,
				unsafe_comps: true,
				warnings: false
			}
		})
	);
}
export default config;
