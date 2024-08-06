
import axios from 'axios';
import {addPathSuffix} from "next/dist/shared/lib/router/utils/add-path-suffix";
import ZiyaadahByPage
  from "@/components/form/MemorizationRecords/ZiyaadahByPage";
// TODO FIX THIS
const MRP_LINK = process.env.MRP_LINK;

export const GetAllZiyaadahRecord = async (server:string | undefined = undefined) => {
  const url: string | undefined = server || process.env.MRP_LINK;

  // If the URL is still undefined, abort the fetching
  if (!url) {
    return {success: false, message: `error there is no server`};
  }


  try {
    const response = await axios.get(`${MRP_LINK}/api/ptq/Ziyaadah/AllRecords`);

    if (response.status === 404) {
      return {success: false, message: `Record not found: ${response.status}`};
    }

    if (response.status !== 200) {
      return {
        success: false,
        message: `HTTP error! status: ${response.status}`,
      };
    }

    const fetchedRecord = response.data;

    return {success: true, message: 'Fetching Success', data: fetchedRecord};
  } catch (error) {
    console.error('Error fetching user by ID:', error);
    return {success: false, message: `Error fetching user by ID: ${error}`};
  }

}

export const GetAllReviewerList = async (server:string | undefined = undefined) => {
  const url: string | undefined = server || process.env.MRP_LINK;

  // If the URL is still undefined, abort the fetching
  if (!url) {
    return {success: false, message: `error there is no server`};
  }


  try {
    const response = await axios.get(`${MRP_LINK}/api/ptq/Ziyaadah/AllReviewers`);

    if (response.status === 404) {
      return {success: false, message: `Record not found: ${response.status}`};
    }

    if (response.status !== 200) {
      return {
        success: false,
        message: `HTTP error! status: ${response.status}`,
      };
    }

    const fetchedReviewer = response.data;

    return {success: true, message: 'Fetching Success', reviewers: fetchedReviewer};
  } catch (error) {
    console.error('Error fetching user by ID:', error);
    return {success: false, message: `Error fetching user by ID: ${error}`};
  }
}


export const GetZiyaadahByUser = async () => {

}

export const GetZiyaadahByReviewer = async () => {

}

export const RecordZiyaadahByVerse = async () => {

}

export interface ZiyaadahData {
  UserID: bigint;
  ReviewerID: bigint;
  StartPage: number;
  EndPage: number;
  ZiyaadahDate: Date;
}

export const RecordZiyaadahByPage = async (ziyaadahData:ZiyaadahData, server:string | undefined = undefined) => {
  const url: string | undefined = server || process.env.MRP_LINK;

  // If the URL is still undefined, abort the fetching
  if (!url) {
    return {success: false, message: `error there is no server`};
  }


  try {
    const response = await axios.post(`${MRP_LINK}/api/ptq/Ziyaadah/AllReviewers`, {
      ...ziyaadahData,
      Type: 'PAGE'
    });

    if (response.status === 404) {
      return {success: false, message: `Record not found: ${response.status}`};
    }

    if (response.status !== 200) {
      return {
        success: false,
        message: `HTTP error! status: ${response.status}`,
      };
    }

    const APIMessage = response.data;

    return {success: true, message: APIMessage};
  } catch (error) {
    console.error('Error fetching user by ID:', error);
    return {success: false, message: `Error fetching user by ID: ${error}`};
  }
}