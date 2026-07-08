"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.POST = void 0;
const square_1 = require("../../../../../modules/square");
const POST = async (req, res) => {
    const squareService = req.scope.resolve(square_1.SQUARE_MODULE);
    const body = req.body;
    const appleResponse = await squareService.setApplePayDomain(body.domain_name);
    if (!appleResponse.success) {
        return res.status(400).json({
            success: false,
            error: "Failed to register domain",
            message: appleResponse.message,
        });
    }
    return res.status(200).json({
        success: true,
        message: "Domain registered successfully",
    });
};
exports.POST = POST;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi8uLi8uLi9zcmMvYXBpL2FkbWluL3NxdWFyZS9jb25maWcvYXBwbGUvcm91dGUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O0FBQ0EsMERBQThEO0FBR3ZELE1BQU0sSUFBSSxHQUFHLEtBQUssRUFBRSxHQUFrQixFQUFFLEdBQW1CLEVBQUUsRUFBRTtJQUNwRSxNQUFNLGFBQWEsR0FBRyxHQUFHLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxzQkFBYSxDQUF3QixDQUFDO0lBRTlFLE1BQU0sSUFBSSxHQUFHLEdBQUcsQ0FBQyxJQUFXLENBQUM7SUFDN0IsTUFBTSxhQUFhLEdBQUcsTUFBTSxhQUFhLENBQUMsaUJBQWlCLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDO0lBRTlFLElBQUksQ0FBQyxhQUFhLENBQUMsT0FBTyxFQUFFLENBQUM7UUFDM0IsT0FBTyxHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQztZQUMxQixPQUFPLEVBQUUsS0FBSztZQUNkLEtBQUssRUFBRSwyQkFBMkI7WUFDbEMsT0FBTyxFQUFFLGFBQWEsQ0FBQyxPQUFPO1NBQy9CLENBQUMsQ0FBQztJQUNMLENBQUM7SUFFRCxPQUFPLEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDO1FBQzFCLE9BQU8sRUFBRSxJQUFJO1FBQ2IsT0FBTyxFQUFFLGdDQUFnQztLQUMxQyxDQUFDLENBQUM7QUFDTCxDQUFDLENBQUM7QUFsQlcsUUFBQSxJQUFJLFFBa0JmIn0=