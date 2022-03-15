const whitelist = ["http://localhost:3000", "https://studio.apollographql.com"];
// Configured as per docs: Configuring CORS w/ Dynamic Origin
// https://www.npmjs.com/package/cors#configuring-cors-w-dynamic-origin
export const corsOptionsDelegate = function (req, callback) {
    let corsOptions;
    if (whitelist.indexOf(req.header("Origin")) !== -1) {
        corsOptions = { origin: true, credentials: true };
    } else {
        corsOptions = { origin: false };
    }
    callback(null, corsOptions);
};
export default corsOptionsDelegate;
