// const config = require('../config');

// class CallJavaApiService {
//     async calljavaApi(payload_body,type) {
//         try {
//             // Construct the full URL
//             const fullUrl = `${config.baseUrl}`;
//             console.log("Making API call to:", fullUrl);

//             // Make the fetch request
//             const response = await fetch(fullUrl, {
//                 method: type.toUpperCase(),
//                 headers: {
//                     "Content-Type": "application/json",
//                     ...(payload_body.auth && { "Authorization": `Bearer ${payload_body.auth}` }),
//                 },
//                 body: payload_body.payload ? JSON.stringify(payload_body) : null,
//             });

//             // Parse the response
//             const data = await response.json();

//             // Handle unsuccessful responses
//             if (!response.ok) {
//                 console.error("API responded with an error:", {
//                     status: response.status,
//                     statusText: response.statusText,
//                     url: fullUrl,
//                     response: data,
//                 });
//                 throw new Error(`HTTP ${response.status}: ${data.message || response.statusText}`);
//             }

//             console.log("API Response:", data);
//             return data;
//         } catch (error) {
//             // Log detailed error information
//             console.error("Error during API call:", {
//                 message: error.message,
//                 stack: error.stack,
//                 url: `${config.baseUrl}${payload_body.endpoint}`,
//                 method: payload_body.type,
//                 payload: payload_body.payload,
//                 auth: !!payload_body.auth,
//             });
//             throw error; // Re-throw the error for further handling
//         }
//     }
// }

// module.exports = CallJavaApiService;


const config = require('../config');

class CallJavaApiService {
    async calljavaApi(payload_body,type) {
        try {
            const fullUrl = `${config.baseUrl}`;
            const response = await fetch(fullUrl, {
                method: type.toUpperCase(),
                headers: {
                    "Content-Type": "application/json",
                    ...(payload_body.auth && { "Authorization": `Bearer ${payload_body.auth}` }),
                },
                body: JSON.stringify(payload_body),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || `HTTP error! Status: ${response.status}`);
            }

            // Removed console.log("API Response:", data);
            return data;
        } catch (error) {
            console.error("Error calling API:", error.message);
            throw error;
        }
    }
}

module.exports = CallJavaApiService;
