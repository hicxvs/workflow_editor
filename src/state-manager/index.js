import { defineStore } from 'pinia';
import { SampleStore, SampleStoreIdentifier } from './sub-managers/sample.store';

export default {
    useSampleStore: defineStore(SampleStoreIdentifier, SampleStore)
};