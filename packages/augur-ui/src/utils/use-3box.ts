import { useEffect, useState } from 'react';
import Box from '3box';

export const use3box = (provider) => {
  const [address, setAddress] = useState();
  const [box, setBox] = useState({});
  const [isReady, setIsReady] = useState(false);
  const [profile, setProfile] = useState();

  useEffect(() => {
    handleLogin();
  }, []);

  useEffect(() => {
    handleLogin();
  }, [provider]);

  // @ts-ignore
  const handleLogin = async () => {
    setIsReady(false);

    if (!provider) {
      return {};
    }

    let threeBoxInstance;
    let addressFromProvider = (await provider.enable())[0];
    let publicProfile;

    try {
      threeBoxInstance = await Box.create(provider);

      await threeBoxInstance.auth([], { address: addressFromProvider });
      await threeBoxInstance.syncDone;

      const space = await threeBoxInstance.openSpace('augur', {});
      await space.syncDone;

      publicProfile = await Box.getProfile(addressFromProvider);
    } catch (error) {
      console.error(error);
      return {};
    }

    setBox(threeBoxInstance);
    setAddress(addressFromProvider);
    setProfile(publicProfile);
    setIsReady(true);
  };

  return {
    address,
    box,
    profile,
    isReady
  };
};
