import Box from '@mui/material/Box';
export default function Credits() {
  return (
    <Box display="flex" flexDirection="column">
      <ul>
        <li>
          Auth Provider -
          (https://www.jeffedmondson.dev/blog/react-protected-routes/)
        </li>
        <li>
          Private routes -
          (https://dev.to/iamandrewluca/private-route-in-react-router-v6-lg5)
        </li>
        <li>
          Schema design-
          (https://www.apollographql.com/blog/backend/schema-design/modularizing-your-graphql-schema-code/)
        </li>
        <li>
          Async controllers -
          (https://stackoverflow.com/questions/51391080/handling-errors-in-express-async-middleware)
        </li>
        <li>Configuring dynamic cors - (https://www.npmjs.com/package/cors)</li>
      </ul>
    </Box>
  );
}
