import { useEffect, useState } from 'react';
import Box from '3box';

export const use3box = (provider, initialize3box, initialized3box, theme) => {
  const [activate, setActivate] = useState(false);
  const [address, setAddress] = useState();
  const [box, setBox] = useState({});
  const [isReady, setIsReady] = useState(false);
  const [profile, setProfile] = useState();

  useEffect(() => {
    handleLogin();
  }, []);

  useEffect(() => {
    handleLogin();
  }, [activate, provider, theme]);

  // @ts-ignore
  const handleLogin = async () => {
    setIsReady(false);

    if (!activate || !provider) {
      setActivate(false);

      return {
        activate,
        setActivate,
      };
    }

    let threeBoxInstance;
    let addressFromProvider = (await provider.enable())[0];
    let publicProfile;

    if (addressFromProvider === initialized3box.address) {
      console.log('#### already initialized 3box');
      threeBoxInstance = initialized3box.box;
      publicProfile = initialized3box.profile;
    } else {
      threeBoxInstance = await Box.create(provider);
      publicProfile = await Box.getProfile(addressFromProvider);
    }

    try {
      await threeBoxInstance.auth([], { address: addressFromProvider });
      await threeBoxInstance.syncDone;

      const space = await threeBoxInstance.openSpace('augur', {});
      await space.syncDone;
    } catch (error) {
      console.error(error);
      setActivate(false);

      return {
        activate,
        setActivate
      };
    }

    setBox(threeBoxInstance);
    setAddress(addressFromProvider);
    setProfile(publicProfile);
    setIsReady(true);

    initialize3box(addressFromProvider, threeBoxInstance, publicProfile);
  };

  return {
    activate,
    setActivate,
    address,
    box,
    profile,
    isReady
  };
};
