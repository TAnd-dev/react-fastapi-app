import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { changeUserData } from '../../redux-store/reducers/view-user-data.js';

import { OrangeButton, RedButton } from '../comps/Button';
import { Input } from '../comps/Input';
import css from '../../styles/styles';

function ShowChangeProfile({
    profileData,
    changeProfileData,
    type = 'changeProfile',
}) {
    const { Profile: ProfileStyles } = css;

    return (
        <ProfileStyles.SectionDetail sectionWidth="60%">
            <ProfileStyles.ProfileDetail detailWidth="50%">
                <h3>Name:</h3>
                {type === 'changeProfile' ? (
                    <Input
                        id={'name'}
                        type={'text'}
                        value={profileData.name}
                        onHandle={e =>
                            changeProfileData({
                                ...profileData,
                                name: e.target.value,
                            })
                        }
                    />
                ) : (
                    <ProfileStyles.ProfileDetailSpan>
                        {profileData.name}
                    </ProfileStyles.ProfileDetailSpan>
                )}
            </ProfileStyles.ProfileDetail>

            <ProfileStyles.ProfileDetail detailWidth="50%">
                <h3>Second Name:</h3>
                {type === 'changeProfile' ? (
                    <Input
                        id={'second_name'}
                        type={'text'}
                        value={profileData.second_name}
                        onHandle={e =>
                            changeProfileData({
                                ...profileData,
                                second_name: e.target.value,
                            })
                        }
                    />
                ) : (
                    <ProfileStyles.ProfileDetailSpan>
                        {profileData.second_name}
                    </ProfileStyles.ProfileDetailSpan>
                )}
            </ProfileStyles.ProfileDetail>

            <ProfileStyles.ProfileDetail detailWidth="50%">
                <h3>Email:</h3>
                <ProfileStyles.ProfileDetailSpan>
                    {profileData.email}
                </ProfileStyles.ProfileDetailSpan>
            </ProfileStyles.ProfileDetail>

            <ProfileStyles.ProfileDetail detailWidth="50%">
                <h3>Number Phone:</h3>
                {type === 'changeProfile' ? (
                    <Input
                        id={'number_phone'}
                        type={'number'}
                        value={profileData.number_phone}
                        onHandle={e =>
                            changeProfileData({
                                ...profileData,
                                number_phone: e.target.value,
                            })
                        }
                    />
                ) : (
                    <ProfileStyles.ProfileDetailSpan>
                        {profileData.number_phone}
                    </ProfileStyles.ProfileDetailSpan>
                )}
            </ProfileStyles.ProfileDetail>
        </ProfileStyles.SectionDetail>
    );
}

export default function Profile() {
    const [profileData, setProfileData] = useState({});
    const userData = useSelector(state => state.userData.userData);
    const dispatch = useDispatch();
    const [typeProfile, setTypeProfile] = useState('profile');
    const { Main, Profile: ProfileStyles, SectionWrapper } = css;

    useEffect(() => {
        setProfileData({ ...userData });
    }, [userData]);

    const fetchProfileData = async () => {
        const dataJson = JSON.stringify({
            name: profileData.name,
            second_name: profileData.second_name,
            number_phone: profileData.number_phone,
        });
        const response = await fetch('http://localhost:8000/user/profile', {
            method: 'PATCH',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: dataJson,
        });

        if (response.ok) {
            const data = await response.json();
            dispatch(changeUserData(data));
            setTypeProfile('profile');
        }
    };

    return (
        <Main>
            <SectionWrapper style={{ justifyContent: 'flex-end' }}>
                <h1
                    style={{
                        width: '100%',
                        marginBottom: '20px',
                        marginLeft: '50px',
                    }}
                >
                    Your Profile
                </h1>
                <ProfileStyles.SectionDetail sectionWidth="40%">
                    <ProfileStyles.ProfilePhotoContainer>
                        <ProfileStyles.ProfilePhoto
                            src={`http://localhost:8000/${userData.photo}`}
                            alt="Photo"
                        />
                        <span>Change Photo</span>
                    </ProfileStyles.ProfilePhotoContainer>
                </ProfileStyles.SectionDetail>
                <ShowChangeProfile
                    profileData={profileData}
                    changeProfileData={setProfileData}
                    type={typeProfile}
                ></ShowChangeProfile>

                <ProfileStyles.SectionDetail sectionWidth="100%">
                    <div style={{ width: '250px', display: 'flex' }}>
                        <OrangeButton
                            text={
                                typeProfile === 'profile'
                                    ? 'Change profile'
                                    : 'Save'
                            }
                            width="40%"
                            onClick={() => {
                                typeProfile === 'profile'
                                    ? setTypeProfile('changeProfile')
                                    : fetchProfileData();
                            }}
                        />
                        <RedButton
                            text={
                                typeProfile === 'profile'
                                    ? 'Delete profile'
                                    : 'Cancel'
                            }
                            width="40%"
                            onClick={() => {
                                typeProfile === 'profile'
                                    ? setTypeProfile('')
                                    : setTypeProfile('profile');
                            }}
                        />
                    </div>
                </ProfileStyles.SectionDetail>
            </SectionWrapper>
        </Main>
    );
}
