import { axiosWithCreds } from "./axiosInstances";

export const createSubscription = async (planId) => {
  const { data } = await axiosWithCreds.post(`/subscriptions`, { planId });
  return data;
};

export const getSubscription = async () => {
  const { data } = await axiosWithCreds.get(`/subscriptions`);
  return data;
};
