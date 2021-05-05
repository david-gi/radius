<template>
  <div>
    <div
      id="intro"
      v-if="expanded"
      class="h6 bg-primary mt-3 mx-n2 p-4 font-weight-normal responsive-font-size"
    >
      <strong class="text-warning">
        Innovative voice conferencing that puts privacy first.
      </strong>
      <ul>
        <li>End-to-end encryption with no middlemen</li>
        <li>Peer-to-peer with zero media proxying</li>
        <li>Created & run by a single developer</li>
        <li>No data profiteering of any kind</li>
        <li>No data permanence</li>
        <li>No data harvesting</li>
        <li>No user tracking</li>
      </ul>
      <strong class="text-warning">
        How does it work?
      </strong>
      <ol>
        <li>
          Start a gathering or join by link
        </li>
        <li>Fill out your name tag</li>
        <li>
          Double-<span class="d-none d-sm-inline">click</span>
          <span class="d-inline d-sm-none">tap</span> to join a circle's
          conversation
        </li>
        <li>
          Add an inner circle
          <ul class="p-0 pl-3">
            <li>
              Talk inside an inner circle while still hearing its containing
              circle
            </li>
            <li>Add another circle for private conversations</li>
          </ul>
        </li>
        <li>Your data is deleted when you leave</li>
        <li>Gathering data is deleted once everyone leaves</li>
      </ol>
      <small class="faded">Optimized for Chrome and Edge (Firefox coming soon)</small>
    </div>
    <small
      v-if="!expanded"
      class="h6 font-weight-bold text-info pointer faded mt-3 mb-n4 d-inline-block"
      @click="expanded = true"
    >
      <u class="pr-1">What is circletalk?</u>
    </small>
  </div>
</template>

<script>
export default {
  name: 'Intro',
  data() {
    return {
      expanded: false
    }
  }
}
</script>
