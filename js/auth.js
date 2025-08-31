// Authentication utilities
import { 
    auth, 
    db,
    storage,
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    signOut, 
    onAuthStateChanged,
    signInWithPopup,
    googleProvider,
    updateProfile,
    updatePassword,
    deleteUser,
    doc,
    setDoc,
    getDoc,
    updateDoc,
    deleteDoc,
    ref,
    uploadBytes,
    getDownloadURL,
    deleteObject
} from './firebase-config.js';

class AuthManager {
    constructor() {
        this.currentUser = null;
        this.initAuthStateListener();
    }

    initAuthStateListener() {
        onAuthStateChanged(auth, (user) => {
            this.currentUser = user;
            this.updateUI();
        });
    }

    updateUI() {
        const authButtons = document.getElementById('auth-buttons');
        const userInfo = document.getElementById('user-info');

        if (this.currentUser) {
            // User is signed in
            if (authButtons) authButtons.style.display = 'none';
            if (userInfo) {
                userInfo.style.display = 'block';
                userInfo.innerHTML = `
                    <div class="user-welcome">
                        <img src="${this.currentUser.photoURL || '/images/default-avatar.png'}" 
                             alt="Profile" class="user-avatar">
                        <span>Welcome, ${this.currentUser.displayName || this.currentUser.email}!</span>
                        <button onclick="authManager.signOut()" class="logout-btn">Logout</button>
                    </div>
                `;
            }
        } else {
            // User is signed out
            if (authButtons) authButtons.style.display = 'block';
            if (userInfo) userInfo.style.display = 'none';
        }
    }

    async signUp(email, password, displayName) {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            
            // Update profile with display name
            await updateProfile(user, {
                displayName: displayName
            });

            // Create user document in Firestore
            await this.createUserProfile(user, {
                displayName: displayName,
                email: email,
                createdAt: new Date().toISOString(),
                theme: 'pink',
                privacy: 'private'
            });

            return { success: true, user };
        } catch (error) {
            console.error('Sign up error:', error);
            return { success: false, error: error.message };
        }
    }

    async signIn(email, password) {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            return { success: true, user: userCredential.user };
        } catch (error) {
            console.error('Sign in error:', error);
            return { success: false, error: error.message };
        }
    }

    async signInWithGoogle() {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            const user = result.user;
            
            // Check if user profile exists, create if not
            const userDoc = await getDoc(doc(db, 'users', user.uid));
            if (!userDoc.exists()) {
                await this.createUserProfile(user, {
                    displayName: user.displayName,
                    email: user.email,
                    photoURL: user.photoURL,
                    createdAt: new Date().toISOString(),
                    theme: 'pink',
                    privacy: 'private'
                });
            }
            
            return { success: true, user };
        } catch (error) {
            console.error('Google sign in error:', error);
            return { success: false, error: error.message };
        }
    }

    async signOut() {
        try {
            await signOut(auth);
            window.location.href = 'index.html';
            return { success: true };
        } catch (error) {
            console.error('Sign out error:', error);
            return { success: false, error: error.message };
        }
    }

    async createUserProfile(user, additionalData = {}) {
        try {
            const userRef = doc(db, 'users', user.uid);
            const userData = {
                uid: user.uid,
                email: user.email,
                displayName: user.displayName || '',
                photoURL: user.photoURL || '',
                bio: '',
                birthday: '',
                telegramUsername: '',
                favoriteQuote: '',
                theme: 'pink',
                privacy: 'private',
                ...additionalData
            };
            
            await setDoc(userRef, userData);
            return userData;
        } catch (error) {
            console.error('Error creating user profile:', error);
            throw error;
        }
    }

    async getUserProfile(uid = null) {
        try {
            const userId = uid || this.currentUser?.uid;
            if (!userId) return null;
            
            const userDoc = await getDoc(doc(db, 'users', userId));
            return userDoc.exists() ? userDoc.data() : null;
        } catch (error) {
            console.error('Error getting user profile:', error);
            return null;
        }
    }

    async updateUserProfile(updates) {
        try {
            if (!this.currentUser) throw new Error('No user logged in');
            
            const userRef = doc(db, 'users', this.currentUser.uid);
            await updateDoc(userRef, {
                ...updates,
                updatedAt: new Date().toISOString()
            });
            
            return { success: true };
        } catch (error) {
            console.error('Error updating user profile:', error);
            return { success: false, error: error.message };
        }
    }

    async uploadProfileImage(file) {
        try {
            if (!this.currentUser) throw new Error('No user logged in');
            
            const fileRef = ref(storage, `profile-images/${this.currentUser.uid}/${file.name}`);
            const snapshot = await uploadBytes(fileRef, file);
            const downloadURL = await getDownloadURL(snapshot.ref);
            
            // Update user profile with new photo URL
            await updateProfile(this.currentUser, {
                photoURL: downloadURL
            });
            
            await this.updateUserProfile({ photoURL: downloadURL });
            
            return { success: true, photoURL: downloadURL };
        } catch (error) {
            console.error('Error uploading profile image:', error);
            return { success: false, error: error.message };
        }
    }

    async changePassword(newPassword) {
        try {
            if (!this.currentUser) throw new Error('No user logged in');
            
            await updatePassword(this.currentUser, newPassword);
            return { success: true };
        } catch (error) {
            console.error('Error changing password:', error);
            return { success: false, error: error.message };
        }
    }

    async deleteAccount() {
        try {
            if (!this.currentUser) throw new Error('No user logged in');
            
            const userId = this.currentUser.uid;
            
            // Delete user data from Firestore
            await deleteDoc(doc(db, 'users', userId));
            
            // Delete user account
            await deleteUser(this.currentUser);
            
            window.location.href = 'index.html';
            return { success: true };
        } catch (error) {
            console.error('Error deleting account:', error);
            return { success: false, error: error.message };
        }
    }

    requireAuth() {
        if (!this.currentUser) {
            window.location.href = 'login.html';
            return false;
        }
        return true;
    }
}

// Create global auth manager instance
const authManager = new AuthManager();
window.authManager = authManager;

export default authManager;