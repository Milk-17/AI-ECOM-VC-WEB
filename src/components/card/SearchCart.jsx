import React, { useEffect, useState } from "react";
import useEcomStore from "../../store/ecom-store";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import { numberFormat } from "../../utils/number";

const SearchCart = () => {
  const getProduct = useEcomStore((state) => state.getProduct);
  const actionSearchFilters = useEcomStore((state) => state.actionSearchFilters);
  const getCategory = useEcomStore((state) => state.getCategory);
  const categories = useEcomStore((state) => state.categories);

  const [text, setText] = useState("");
  const [mainCategorySelected, setMainCategorySelected] = useState(null);
  const [subCategorySelected, setSubCategorySelected] = useState(null);

  // --- 1. State สำหรับ Logic ราคา ---
  const [price, setPrice] = useState([100, 50000]); // ค่าจริงที่ใช้ค้นหาและแสดงใน Slider
  const [ok, setOk] = useState(false);

  // --- 2. State แยกสำหรับการพิมพ์ (UI Only) ---
  // แก้ปัญหาพิมพ์ยาก: แยกค่าที่แสดงใน Input ออกจากค่าจริง
  const [minString, setMinString] = useState("100");
  const [maxString, setMaxString] = useState("50000");

  useEffect(() => {
    getCategory();
  }, []);

  // Search by text
  useEffect(() => {
    const delay = setTimeout(() => {
      if (text) actionSearchFilters({ query: text });
      else getProduct();
    }, 300);
    return () => clearTimeout(delay);
  }, [text]);

  // Search by category (Logic เดิม)
  useEffect(() => {
    let categoryIds = [];
    if (subCategorySelected) categoryIds = [subCategorySelected];
    else if (mainCategorySelected) {
      const selectedMain = categories.find((c) => c.id === mainCategorySelected);
      if (selectedMain?.subCategories) {
        categoryIds = selectedMain.subCategories.map((s) => s.id);
      }
    }
    if (categoryIds.length > 0) actionSearchFilters({ category: categoryIds });
    else getProduct();
  }, [mainCategorySelected, subCategorySelected, categories]);

  // Search by price (ส่งค่า price จริงไปค้นหา)
  useEffect(() => {
    actionSearchFilters({ price });
  }, [ok]);


  // --- 3. Logic ใหม่: Slider เปลี่ยน -> อัปเดต Input ด้วย ---
  const handleSliderChange = (value) => {
    setPrice(value);
    // อัปเดตตัวเลขในกล่องข้อความให้ตรงกับ Slider
    setMinString(value[0].toString());
    setMaxString(value[1].toString());
    // Trigger ค้นหา (Debounce slider นิดหน่อยเพื่อให้ลื่น)
    setTimeout(() => setOk(!ok), 300);
  };

  // --- 4. Logic ใหม่: พิมพ์ใน Input (ยังไม่ค้นหาทันที) ---
  const handleInputChange = (e, type) => {
    const value = e.target.value;
    if (type === "min") setMinString(value);
    else setMaxString(value);
  };

  // --- 5. Logic ใหม่: พิมพ์เสร็จแล้ว (OnBlur / Enter) ค่อยคำนวณ ---
  const handleBlur = () => {
    // แปลงค่าที่พิมพ์เป็นตัวเลข (ถ้าว่างให้เป็น 0)
    let minVal = parseInt(minString.replace(/,/g, "")) || 0;
    let maxVal = parseInt(maxString.replace(/,/g, "")) || 0;

    // Validate: ป้องกัน Min > Max หรือเลขติดลบ
    if (minVal < 0) minVal = 0;
    if (maxVal < 0) maxVal = 0;
    if (minVal > maxVal) {
      // ถ้าลูกค้ากรอก Min มากกว่า Max -> สลับค่าให้เองเลย (Smart UI)
      const temp = minVal;
      minVal = maxVal;
      maxVal = temp;
    }

    // อัปเดต State ทุกตัวให้ตรงกัน
    setPrice([minVal, maxVal]);
    setMinString(minVal.toString());
    setMaxString(maxVal.toString());
    setOk(!ok); // Trigger ค้นหา
  };
  
  // รองรับการกด Enter
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
        handleBlur();
    }
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border">
      <h1 className="text-xl font-bold mb-4">ค้นหาสินค้า</h1>

      {/* Search Text */}
      <input
        type="text"
        placeholder="ค้นหาสินค้า..."
        className="border rounded-md w-full mb-4 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <hr className="mb-4" />

      {/* Category */}
      <div className="mb-4">
        <h1 className="font-semibold mb-2">หมวดหมู่สินค้า</h1>
        <select
          className="border rounded-md px-2 py-2 w-full mb-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
          value={mainCategorySelected || ""}
          onChange={(e) => {
            setMainCategorySelected(Number(e.target.value) || null);
            setSubCategorySelected(null);
          }}
        >
          <option value="">-- เลือกหมวดหมู่หลัก --</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>

        {mainCategorySelected && (
          <select
            className="border rounded-md px-2 py-2 w-full focus:outline-none focus:ring-1 focus:ring-blue-500"
            value={subCategorySelected || ""}
            onChange={(e) => setSubCategorySelected(Number(e.target.value) || null)}
          >
            <option value="">-- เลือกหมวดหมู่ย่อย --</option>
            {categories
              .find((c) => c.id === mainCategorySelected)
              ?.subCategories?.map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
          </select>
        )}
      </div>

      <hr className="mb-4" />

      {/* Price Range (Updated UX) */}
      <div>
        <h1 className="font-semibold mb-2">ช่วงราคา (บาท)</h1>
        
        {/* Slider */}
        <div className="px-2 mb-4">
          <Slider
            range
            min={0}
            max={100000} // ปรับ Max ตามความเหมาะสม
            defaultValue={[100, 50000]}
            value={price}
            onChange={handleSliderChange}
            trackStyle={[{ backgroundColor: '#2563eb', height: 6 }]} // เส้นสีน้ำเงิน
            handleStyle={[
                { borderColor: '#2563eb', backgroundColor: '#fff', opacity: 1, boxShadow: '0 0 5px rgba(0,0,0,0.1)' },
                { borderColor: '#2563eb', backgroundColor: '#fff', opacity: 1, boxShadow: '0 0 5px rgba(0,0,0,0.1)' }
            ]}
            railStyle={{ backgroundColor: '#e5e7eb', height: 6 }} // พื้นหลังเส้น
          />
        </div>

        {/* Inputs */}
        <div className="flex justify-between items-center gap-2">
            
            {/* Min Input */}
            <div className="relative w-1/2">
                <input
                    type="number"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-center focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    placeholder="Min"
                    value={minString}
                    onChange={(e) => handleInputChange(e, "min")}
                    onBlur={handleBlur}   // ทำงานเมื่อคลิกออก
                    onKeyDown={handleKeyDown} // ทำงานเมื่อกด Enter
                />
            </div>

            <span className="text-gray-400">-</span>

            {/* Max Input */}
            <div className="relative w-1/2">
                <input
                    type="number"
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-center focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    placeholder="Max"
                    value={maxString}
                    onChange={(e) => handleInputChange(e, "max")}
                    onBlur={handleBlur}
                    onKeyDown={handleKeyDown}
                />
            </div>
        </div>
      </div>
    </div>
  );
};

export default SearchCart;