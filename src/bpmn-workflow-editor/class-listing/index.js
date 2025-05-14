import ApiEngine from '../../api-engine';
import { API_LOCAL_BASE_URL, API_RESOURCE_CLASS_LISTING_URL } from "../../config";
import JavasClasses from './fw-class-listing.json';

export function ClassListing() {

    const apiEngine = new ApiEngine(`${API_LOCAL_BASE_URL}`);

    async function getAllJavaClasses() {
        try {
            const response = await apiEngine.get(`${API_RESOURCE_CLASS_LISTING_URL}`);
            return response.data?.files || [];
        } catch (error) {
            console.error('Error loading java classes', error);
            throw error;
        }
    }

    function getAllInMemoryJavaClasses() {
        try {
            return JavasClasses.files || [];
        } catch (error) {
            console.error('Error loading in memory java classes', error);
            throw error;
        }
    }

    return {
        getAllJavaClasses,
        getAllInMemoryJavaClasses
    };
}