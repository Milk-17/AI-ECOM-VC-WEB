import axios from 'axios';

// ---------------- Main Category ----------------

export const createCategory = async (token , form) => {
    return await axios.post('https://ai-ecom-vc-api.vercel.app/api/category',form,{
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}

export const listCategory = async () => {
    return await axios.get('https://ai-ecom-vc-api.vercel.app/api/category')
}
    
export const removeCategory = async (token,id) => {
    return await axios.delete('https://ai-ecom-vc-api.vercel.app/api/category/'+id,{
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}

//  เพิ่มฟังก์ชัน Update Main Category 
export const updateCategory = async (token, id, form) => {
    return await axios.put('https://ai-ecom-vc-api.vercel.app/api/category/'+id, form, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}


// ---------------- Sub Category ----------------

export const createSubCategory = async (token, form) => {
    // 'form' คือ object ที่มี { name, categoryId }
    return await axios.post(
      "https://ai-ecom-vc-api.vercel.app/api/subcategory", 
      form,
      {
        headers: {
          Authorization: `Bearer ${token}`, 
        },
      }
    );
};
  
// ลบ SubCategory
export const removeSubCategory = async (token, id) => {
    return await axios.delete(
        "https://ai-ecom-vc-api.vercel.app/api/subcategory/" + id, 
        {
        headers: {
            Authorization: `Bearer ${token}`, 
        },
        }
    );
};

//  เพิ่มฟังก์ชัน Update Sub Category 
export const updateSubCategory = async (token, id, form) => {
    return await axios.put(
        "https://ai-ecom-vc-api.vercel.app/api/subcategory/" + id, 
        form,
        {
        headers: {
            Authorization: `Bearer ${token}`, 
        },
        }
    );
};