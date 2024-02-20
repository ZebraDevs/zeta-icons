export default {
    plugins: [
        {
            name: "removeUselessDefs",
        },
        {
            name: "convertShapeToPath",
        },
        {
            name: "mergePaths",
        },
        {
            name: "removeDimensions",
        },
        {
            name: "removeAttrs",
            params: {
                attrs: ["clip-path"],
            },
        },
    ],
};