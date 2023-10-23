import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import axios from "axios";

export const useProdukStore = create(
  devtools(
    immer((set) => ({
      produkData: [],
      getApi: async () => {
        const apiResponse = await axios.get("http://localhost:4000/produk");
        set((state: { produkData: any; }) => {
          state.produkData = apiResponse.data;
        });
      },
      
      createProdukAPI: async (nama:any, deskripsi:any) => {
        const apiResponse = await axios.post(
          "http://localhost:4000/produk",
          nama, deskripsi
        );
        set((state: { produkData: any[]; }) => {
          state.produkData.push(apiResponse.data);
        });
      },

      updateProdukAPI: async (payload: any) => {
        const apiResponse = await axios.put(
          `http://localhost:4000/produk/${payload.id}`,
          payload
        );
        
        set((state:any) => {
          let produkState = state.produkData.filter((_:any) => _.id !== payload.id);
          produkState.push(apiResponse.data);
          state.produkData = produkState;
        });
      },

      deleteProdukAPI: async (id: any) => {
        const apiResponse = await axios.delete(
          `http://localhost:4000/produk/${id}`
        );
        set((state:any) => {
          state.produkData = state.produkData.filter((_:any) => _.id !== id);
        });
      },
    }))
  )
);

export const getProdukById = (id: any) => {
  return (state:any) => {
    let produk = state.produkData.filter((c:any) => c.id === Number(id));
    if (produk) {
      return produk[0];
    }
    return null;
  };
};